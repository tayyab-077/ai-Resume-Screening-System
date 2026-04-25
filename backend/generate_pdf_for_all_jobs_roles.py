from fpdf import FPDF
import os
import random

# ✅ Folder path
folder_path = r"C:\Users\Tayyab\Desktop\1 Resume Screening System 2026\screenshots for knowledge\demo_resumes"
os.makedirs(folder_path, exist_ok=True)

def clean_text(text):
    return text.encode("latin-1", "replace").decode("latin-1")

# ---------------- JOB ROLES ----------------
job_roles = [
    "Data Scientist", "Frontend Developer", "Backend Developer",
    "Full Stack Developer", "Machine Learning Engineer",
    "Data Analyst", "DevOps Engineer", "Software Engineer",
    "NLP Engineer", "Business Analyst"
]

# ---------------- SKILLS MAP ----------------
skills_map = {
    "Data Scientist": ["Python", "Machine Learning", "NLP", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "SQL"],
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Redux", "Tailwind"],
    "Backend Developer": ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST API", "JWT"],
    "Full Stack Developer": ["React", "Node.js", "MongoDB", "Express", "REST API"],
    "Machine Learning Engineer": ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Model Deployment"],
    "Data Analyst": ["SQL", "Excel", "Power BI", "Tableau", "Python"],
    "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "CI/CD", "Jenkins", "Linux"],
    "Software Engineer": ["Java", "Python", "DSA", "System Design", "API"],
    "NLP Engineer": ["Python", "NLP", "Transformers", "HuggingFace", "spaCy"],
    "Business Analyst": ["Excel", "SQL", "Power BI", "Requirement Gathering", "Stakeholder Management"]
}

# ---------------- GLOBAL SKILLS (for cross-domain noise) ----------------
extra_skills_pool = [
    "Git", "Docker", "AWS", "Python", "SQL", "API", "Linux", "Tableau"
]

# ---------------- NAMES (UNIQUE COMBINATIONS) ----------------
first_names = ["Faiz", "Ravi", "Gurpreet", "Maria", "Fatima", "Harpreet",
               "Zara", "Ananya", "John", "Emma", "Olivia", "Liam",
               "Sophia", "Lucas", "Chen", "Hiroshi"]

last_names = ["Kumar", "Singh", "Ali", "Iyer", "Smith", "Johnson",
              "Brown", "Wilson", "Martinez", "Anderson", "Tanaka", "Wei"]

def generate_unique_name():
    return f"{random.choice(first_names)} {random.choice(last_names)}"

# ---------------- DEGREES ----------------
degrees = [
    "B.Tech Computer Science", "B.Tech IT", "M.Tech AI",
    "B.Sc Data Science", "M.Sc Analytics",
    "BCA", "MCA", "MBA Business Analytics", "B.Sc Statistics"
]

# ---------------- EXPERIENCE TEMPLATES ----------------
strong_exp = [
    "3+ years building scalable systems and deploying real-world applications",
    "Experienced in production-level projects and system optimization",
    "Worked on end-to-end development and deployment pipelines"
]

medium_exp = [
    "1–2 years of hands-on experience with practical exposure",
    "Worked on real-world projects and collaborative development",
    "Experience with tools and frameworks in practical environments"
]

weak_exp = [
    "Fresher with academic projects and internships",
    "Basic understanding with project-level exposure",
    "Entry-level candidate with learning experience"
]

# ---------------- GENERATE RESUMES ----------------
resumes = []
unique_names_used = set()

for role in job_roles:
    base_skills = skills_map[role]

    for i in range(3):  # ✅ ONLY 3 PER ROLE

        # 🎯 Unique name
        while True:
            name = generate_unique_name()
            if name not in unique_names_used:
                unique_names_used.add(name)
                break

        # 🎯 Skill variation
        if i == 0:  # strong
            skills = random.sample(base_skills, k=len(base_skills) - 1)
            skills += random.sample(extra_skills_pool, 2)

        elif i == 1:  # moderate
            skills = random.sample(base_skills, k=max(3, len(base_skills)//2))
            skills += random.sample(extra_skills_pool, 1)

        else:  # weak
            skills = random.sample(base_skills, k=2)
            if random.random() > 0.5:
                skills += random.sample(extra_skills_pool, 1)

        skills = list(set(skills))

        # 🎯 Experience
        if i == 0:
            experience = random.choice(strong_exp)
        elif i == 1:
            experience = random.choice(medium_exp)
        else:
            experience = random.choice(weak_exp)

        resume = {
            "name": name,
            "role": role,
            "skills": ", ".join(skills),
            "experience": experience,
            "education": random.choice(degrees)
        }

        resumes.append(resume)

# ---------------- PDF FUNCTION ----------------
def create_pdf(resume, index):
    pdf = FPDF()
    pdf.add_page()

    pdf.set_font("Arial", size=12)

    pdf.cell(200, 10, txt=clean_text(resume["name"]), ln=True)
    pdf.cell(200, 10, txt=clean_text(resume["role"]), ln=True)

    pdf.ln(5)

    pdf.multi_cell(0, 8, txt=clean_text("Skills: " + resume["skills"]))
    pdf.multi_cell(0, 8, txt=clean_text("Experience: " + resume["experience"]))
    pdf.multi_cell(0, 8, txt=clean_text("Education: " + resume["education"]))

    filename = f"{resume['name'].replace(' ', '_')}_{resume['role'].replace(' ', '_')}_{index}.pdf"
    file_path = os.path.join(folder_path, filename)

    pdf.output(file_path)

# ---------------- RUN ----------------
for idx, r in enumerate(resumes):
    create_pdf(r, idx)

print("✅ 30 unique realistic resumes generated successfully!")