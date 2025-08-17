import re

# very small, simple tokenizer
def _tok(s: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", (s or "").lower()))

def get_sources_with_confidence(sources, query, name_weight=2.0, desc_weight=1.0):

    q_tokens = _tok(query)
    if not q_tokens:
        return []

    results = []
    # per-token max score is name_weight + desc_weight
    per_token_max = name_weight + desc_weight
    max_possible = per_token_max * len(q_tokens)

    for source in sources:
        name_toks = _tok(source.get("name", ""))
        desc_toks = _tok(source.get("description", ""))

        # sum contribution per query token
        raw = 0.0
        for t in q_tokens:
            if t in name_toks:
                raw += name_weight
            if t in desc_toks:
                raw += desc_weight

        # normalize into [0,1]
        confidence = round(raw / max_possible, 2) if max_possible else 0.0
        if confidence > 0:
            results.append({"source_id": source["id"], "confidence": confidence})

    # sort by confidence, then name for stability
    results.sort(key=lambda r: (-r["confidence"], r["source_id"]))
    return results
