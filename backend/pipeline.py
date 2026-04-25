from backend.parser import extract_text_from_pdf
from backend.embedding import get_embedding
from backend.similarity import compute_similarity
from backend.skill_extractor import extract_skills
from backend.gap_analysis import skill_gap_analysis
import os

def run_pipeline(data_dir, job_description):

    print("🚀 PIPELINE STARTED")
    results = []

    job_embedding = get_embedding(job_description)
    jd_skills = extract_skills(job_description)

    for file_name in os.listdir(data_dir):
        if file_name.endswith(".pdf"):

            file_path = os.path.join(data_dir, file_name)

            resume_text = extract_text_from_pdf(file_path)

            resume_embedding = get_embedding(resume_text)

            semantic_score = float(compute_similarity(resume_embedding, job_embedding))

            resume_skills = extract_skills(resume_text)

            matched, missing = skill_gap_analysis(resume_skills, jd_skills)

            # ✅ Safe skill scoring
            skill_match_ratio = len(matched) / len(jd_skills) if jd_skills else 0

            # 🔥 Improved weighting (more realistic ATS)
            final_score = (0.65 * semantic_score) + (0.35 * skill_match_ratio)

            # ✅ Labeling
            if final_score >= 0.75:
                label = "Strong Fit"
            elif final_score >= 0.45:
                label = "Moderate Fit"
            else:
                label = "Low Fit"

            results.append({
                "name": str(file_name),
                "score": float(round(final_score * 100, 2)),
                "label": label,
                "matched": list(matched),
                "missing": list(missing)
            })

    results = sorted(results, key=lambda x: x["score"], reverse=True)

    return results