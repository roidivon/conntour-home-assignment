import json
import os
from typing import Dict, List
import uuid
from datetime import datetime


class SpaceDB:

    _searches = []
    _search_results = []
    _sources = []

    def __init__(self):
        # Load and parse the JSON data
        data_path = os.path.join(os.path.dirname(__file__), "mock_data.json")
        with open(data_path, "r") as f:
            json_data = json.load(f)
        # Flatten and map the data to the expected format
        items = json_data.get("collection", {}).get("items", [])
        for idx, item in enumerate(items, start=1):
            data = item.get("data", [{}])[0]
            links = item.get("links", [])
            image_url = None
            for link in links:
                if link.get("render") == "image":
                    image_url = link.get("href")
                    break
            self._sources.append(
                {
                    "id": idx,
                    "name": data.get("title", f"NASA Item {idx}"),
                    "type": data.get("media_type", "unknown"),
                    "launch_date": data.get("date_created", ""),
                    "description": data.get("description", ""),
                    "image_url": image_url,
                    "status": "Active",
                }
            )
        self._next_id = len(self._sources) + 1

    def get_all_sources(self):
        """Get all space sources."""
        return self._sources

    def get_source_by_id(self, source_id):
        return next((source for source in self._sources if source["id"] == source_id), None)

    def add_search(self, query):
        new_search ={
            "id": str(uuid.uuid4()),
            "query": query,
            "last_used": datetime.now().isoformat()
        }
        self._searches.insert(0, new_search)
        return new_search

    def add_search_results(self, search_results):
        self._search_results.extend(search_results)

    def get_search_by_query(self, query):
        return next((search for search in self._searches if search["query"] == query), None)

    def get_searches(self, cursor, page_size):
        sorted_searches = sorted(self._searches, reverse=True, key=lambda search: search["last_used"])
        if not cursor:
            result = sorted_searches[0:page_size]
            return {"content": result, "total_count": len(sorted_searches)}
        index = next((i for i, search in enumerate(sorted_searches) if search["last_used"] < cursor), None)
        return {"content": sorted_searches[index : index + page_size], "total_count": len(sorted_searches)}

    def delete_search(self, search_id):
        self._searches = [search for search in self._searches if search["id"] != search_id]

    def get_search_by_id(self, search_id):
        return next((search for search in self._searches if search["id"] == search_id), None)

    def get_search_results_by_search_id(self, search_id):
        return [search_result for search_result in self._search_results if search_result["search_id"] == search_id]

    def update_search_last_used(self, search_id, last_used):
        self._searches = [{**search, "last_used": last_used} if search["id"] == search_id else search for search in self._searches]
