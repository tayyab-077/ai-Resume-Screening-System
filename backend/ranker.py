def rank_candidates(results):
    """
    Rank candidates based on final score
    
    Why:
    - Recruiters need sorted candidates (best → worst)
    """
    
    ranked = sorted(results, key=lambda x: x["score"], reverse=True)
    
    return ranked