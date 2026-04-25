from backend.model import model
from sentence_transformers import util

SKILLS_DB = [

    # DATA
    "python", "sql", "pandas", "numpy",
    "data analysis", "data visualization",
    "statistics", "data modeling",

    # ML
    "machine learning", "deep learning", "nlp",
    "scikit-learn", "tensorflow", "pytorch",

    # BI
    "excel", "power bi", "tableau",
    "dashboard", "reporting",

    # DEVOPS
    "docker", "kubernetes",
    "ci/cd", "aws", "azure",
    "git",

    # FRONTEND
    "html", "css", "javascript", "react",
    "redux", "tailwind",
    "responsive design", "state management",

    # BACKEND
    "fastapi", "rest api", "node.js", "express",

    # BUSINESS
    "business analysis",
    "requirement gathering",
    "stakeholder management",
    "communication"
]

def normalize(text):
    return text.lower().replace("/", "").replace("-", "").replace(" ", "")

# Precompute skill embeddings
skill_embeddings = {
    skill: model.encode(skill, convert_to_tensor=True)
    for skill in SKILLS_DB
}

def extract_skills(text):
    text = text.lower()
    normalized_text = normalize(text)

    extracted_skills = []

    # Encode full text once
    text_embedding = model.encode(text, convert_to_tensor=True)

    for skill in SKILLS_DB:

        # ✅ Keyword match (fast + precise)
        if skill in text or normalize(skill) in normalized_text:
            extracted_skills.append(skill)
            continue

        # ✅ Semantic fallback (NLP)
        score = util.cos_sim(text_embedding, skill_embeddings[skill]).item()

        if score > 0.45:
            extracted_skills.append(skill)

    return list(set(extracted_skills))