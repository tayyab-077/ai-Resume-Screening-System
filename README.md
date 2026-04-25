1. 🔷 Project Title
AI Resume Screening System (Hybrid NLP ATS)

![Python](https://img.shields.io/badge/Python-3.10-blue)
![NLP](https://img.shields.io/badge/NLP-Transformer-green)
![Model](https://img.shields.io/badge/Model-MiniLM-orange)
![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

2. 📌 Overview (START HERE)
Write this:

This project is an AI-powered Resume Screening System that automates candidate evaluation using a hybrid NLP approach (keyword matching + semantic embeddings). It analyzes resumes against job descriptions and ranks candidates based on similarity and skill matching.

3. 🎯 Objectives
Add:

Automate resume screening

Improve matching accuracy

Reduce recruiter effort

Minimize bias

Provide skill gap insights

4. 🧠 Key Features
Add:

PDF Resume Parsing

Hybrid Skill Extraction (Keyword + NLP)

Semantic Similarity Matching

Skill Gap Analysis

Candidate Ranking System

Bias Reduction

5. ⚙️ Tech Stack
Add table:

Category	Tools
Backend	Python
NLP	sentence-transformers
Model	all-MiniLM-L6-v2
PDF	PyMuPDF
Similarity	Scikit-learn
Frontend	React
6. 🏗️ Architecture (VERY IMPORTANT)
Resume → Text Extraction → Embedding → Skill Extraction → 
Similarity → Gap Analysis → Score → Ranking
7. 🧪 Methodology
Add these subsections:
🔹 Text Extraction
PDF → Text using PyMuPDF

🔹 Embeddings
Using SentenceTransformer

🔹 Skill Extraction
Keyword match

Semantic match

🔹 Gap Analysis
Matched vs Missing skills

🔹 Similarity
Cosine similarity

8. 📊 Scoring Logic
Final Score = (0.65 × Semantic Score) + (0.35 × Skill Match Ratio)
9. 🏆 Candidate Classification
Score	Label
≥ 75%	Strong Fit
45–74%	Moderate Fit
< 45%	Low Fit
10. 📈 Evaluation (NEW — MUST ADD)
👉 THIS replaces “training”

Write:
The system uses a pretrained transformer model and does not require custom training.

Add metrics:
Skill Matching Accuracy

Semantic Similarity

Ranking Quality

Add example:
Metric	Value
Accuracy	~80–90%
Ranking	Consistent

🖼️ 2. Screenshots Section (VERY IMPORTANT)
Add this section:

## 📸 Screenshots

### 🔹 Upload Interface
![Upload](screenshots/upload.png)

### 🔹 Analysis Output
![Output](screenshots/output.png)

### 🔹 Skill Gap Analysis
![Gap](screenshots/gap.png)
📁 Folder structure:
Create:

/screenshots
   upload.png
   output.png
   gap.png
👉 Take screenshots of:

UI upload page

Results page

Skills matched/missing


11. ⚖️ Bias Reduction
Not keyword-only

Uses semantic understanding

Balanced scoring

12. 🚧 Limitations
Depends on skill database

No deep experience evaluation

13. 🔮 Future Scope
Dynamic skill DB

Experience scoring

Dashboard

Job portal integration

14. ▶️ How to Run
uvicorn backend.main:app --reload
npm run dev
15. 🌐 Deployment (Optional)
ngrok http 8000
💥 MOST IMPORTANT LINE (ADD THIS AT END)
This system uses a hybrid NLP approach co


## 👨‍💻 Portfolio Description

Developed an AI-powered Resume Screening System using a hybrid NLP approach combining keyword matching and transformer-based semantic similarity.

The system automates candidate evaluation, performs skill gap analysis, and ranks candidates using a bias-reduced scoring mechanism. Designed to simulate real-world Applicant Tracking Systems (ATS), improving recruitment efficiency and decision-making.

**Key Skills:** NLP, Machine Learning, Python, Transformers, React, System Designmbining rule-based skill extraction with transformer-based semantic similarity to improve accuracy and reduce bias in candidate ranking.

