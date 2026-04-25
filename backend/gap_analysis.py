from backend.model import model
from sentence_transformers import util

def normalize(text):
    return text.lower().replace("/", "").replace("-", "").replace(" ", "")

def skill_gap_analysis(resume_skills, jd_skills):

    matched = []
    missing = []

    for jd_skill in jd_skills:
        jd_norm = normalize(jd_skill)
        jd_emb = model.encode(jd_skill, convert_to_tensor=True)

        found = False

        for r_skill in resume_skills:
            r_norm = normalize(r_skill)

            # ✅ Exact match
            if jd_norm == r_norm:
                matched.append(jd_skill)
                found = True
                break

            # ✅ Semantic match
            r_emb = model.encode(r_skill, convert_to_tensor=True)
            score = util.cos_sim(jd_emb, r_emb).item()

            if score > 0.6:
                matched.append(jd_skill)
                found = True
                break

        if not found:
            missing.append(jd_skill)

    return matched, missing