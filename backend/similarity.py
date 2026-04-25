from sklearn.metrics.pairwise import cosine_similarity

def compute_similarity(vec1, vec2):
    """
    Compute similarity between resume and job description
    
    Why:
    - Measures how close two texts are in meaning
    - Output: value between 0 and 1
    """
    
    score = cosine_similarity([vec1], [vec2])[0][0]
    
    return score