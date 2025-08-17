import time
from datetime import datetime
from data.db import SpaceDB
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Source, SearchInput
from utils import get_sources_with_confidence

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = SpaceDB()

@app.get("/api/search")
def get_searches(cursor: str, page_size: int):
    time.sleep(1)
    return db.get_searches(cursor, page_size)

@app.post("/api/search")
def search_sources(input: SearchInput):
    exist_by_query = db.get_search_by_query(input.query)
    if exist_by_query:
        print("found existing search")
        last_used = datetime.now().isoformat()
        db.update_search_last_used(exist_by_query["id"], last_used)
        return {**exist_by_query, "last_used": last_used}
    new_search = db.add_search(input.query)
    print(f"created new search: {new_search['id']}")
    results = get_sources_with_confidence(db.get_all_sources(), input.query)
    db.add_search_results([{**item, "search_id": new_search["id"]} for item in results])
    return new_search

@app.delete("/api/search/{search_id}")
def delete_search(search_id: str):
    print(f"delete {search_id}")
    db.delete_search(search_id)


@app.get("/api/search-results/{search_id}")
def get_search_by_id(search_id: str):
    search = db.get_search_by_id(search_id)
    if not search:
        raise HTTPException(status_code=404, detail=f"Search {search_id} not found")
    search_results = db.get_search_results_by_search_id(search_id)
    result = []
    for search_result in search_results:
        source = db.get_source_by_id(search_result["source_id"])
        result.append({**source, "confidence": search_result["confidence"]})
    return result


