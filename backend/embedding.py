from backend.model import model

def get_embedding(text):

    """
    Convert text into numerical vector using transformer model
    
    Why:
    - Models understand numbers, not raw text
    - Embeddings capture semantic meaning
    """

    return model.encode(text, normalize_embeddings=True)