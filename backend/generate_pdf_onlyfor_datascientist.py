from fpdf import FPDF
import os

# ✅ Your folder path
folder_path = r"C:\Users\Tayyab\Desktop\1 Resume Screening System 2026\screenshots for knowledge\demo_resumes"

# ✅ Create folder if not exists
os.makedirs(folder_path, exist_ok=True)




resumes = [
    # -------- STRONG MATCH (1–8)
    {"name":"Arjun Mehta","role":"Data Scientist","skills":"Python, ML, NLP, Pandas, NumPy, TensorFlow, SQL, FastAPI, Git","experience":"3 years building NLP systems and deploying ML models","education":"B.Tech CS"},
    {"name":"Sneha Kapoor","role":"ML Engineer","skills":"Python, TensorFlow, Deep Learning, NLP, SQL, Seaborn, REST API, Git","experience":"2.5 years in ML pipelines and sentiment analysis","education":"M.Tech AI"},
    {"name":"Karan Shah","role":"Data Scientist","skills":"Python, ML, NLP, Pandas, NumPy, Scikit-learn, SQL, FastAPI","experience":"3 years in predictive modeling and deployment","education":"B.Tech IT"},
    {"name":"Ritika Jain","role":"AI Engineer","skills":"Python, NLP, TensorFlow, Deep Learning, SQL, APIs","experience":"2 years building chatbot systems","education":"M.Tech AI"},
    {"name":"Aditya Verma","role":"Data Scientist","skills":"Python, ML, NLP, Pandas, NumPy, SQL, Git","experience":"3 years in ML model development","education":"B.Tech CS"},
    {"name":"Neeraj Gupta","role":"ML Engineer","skills":"Python, TensorFlow, NLP, SQL, FastAPI","experience":"2.5 years deploying ML APIs","education":"B.Tech"},
    {"name":"Pooja Sharma","role":"Data Scientist","skills":"Python, ML, NLP, Pandas, NumPy, SQL, Seaborn","experience":"3 years analytics + ML","education":"M.Sc Data Science"},
    {"name":"Manish Kumar","role":"AI Developer","skills":"Python, NLP, ML, TensorFlow, SQL, REST APIs","experience":"2.5 years AI systems","education":"B.Tech"},

    # -------- MEDIUM MATCH (9–17)
    {"name":"Rohit Verma","role":"Data Analyst","skills":"Python, Pandas, NumPy, SQL, Matplotlib","experience":"2 years data analysis","education":"B.Sc"},
    {"name":"Priya Singh","role":"Data Analyst","skills":"Python, SQL, Excel, Pandas","experience":"2 years reporting and dashboards","education":"BCA"},
    {"name":"Ankit Yadav","role":"Junior Data Scientist","skills":"Python, ML basics, Pandas, NumPy","experience":"1 year ML internship","education":"B.Tech"},
    {"name":"Shreya Das","role":"Analyst","skills":"SQL, Excel, Python basics","experience":"2 years analytics","education":"BBA"},
    {"name":"Nikhil Arora","role":"Backend Developer","skills":"Python, FastAPI, REST APIs, Git","experience":"2 years backend work","education":"B.Tech"},
    {"name":"Simran Kaur","role":"ML Intern","skills":"Python, ML basics, TensorFlow","experience":"6 months internship","education":"B.Tech"},
    {"name":"Aman Mishra","role":"Data Analyst","skills":"Python, Pandas, SQL, Visualization","experience":"1.5 years analytics","education":"B.Sc"},
    {"name":"Kriti Verma","role":"Software Engineer","skills":"Python, APIs, Git","experience":"2 years development","education":"B.Tech"},
    {"name":"Deepak Singh","role":"BI Analyst","skills":"SQL, Excel, Power BI","experience":"3 years dashboards","education":"B.Com"},

    # -------- WEAK MATCH (18–23)
    {"name":"Vikram Yadav","role":"MIS Executive","skills":"Excel, Reporting, Basic SQL","experience":"3 years MIS work","education":"B.Com"},
    {"name":"Ramesh Patel","role":"Clerk","skills":"MS Office, Data Entry","experience":"5 years clerical work","education":"12th"},
    {"name":"Sonal Gupta","role":"HR Executive","skills":"Recruitment, Communication","experience":"2 years HR","education":"MBA HR"},
    {"name":"Pankaj Sharma","role":"Sales Executive","skills":"Sales, CRM","experience":"4 years sales","education":"BBA"},
    {"name":"Meena Kumari","role":"Teacher","skills":"Teaching, Communication","experience":"6 years teaching","education":"B.Ed"},
    {"name":"Rajesh Kumar","role":"Accountant","skills":"Accounting, Tally","experience":"5 years accounts","education":"B.Com"},

    # -------- EDGE CASES (24–25)
    {"name":"Dev Malhotra","role":"Data Scientist","skills":"Python, ML, NLP","experience":"Fresher with strong projects","education":"B.Tech"},
    {"name":"Ananya Bose","role":"Research Intern","skills":"Python, NLP, Deep Learning, TensorFlow","experience":"Academic research only","education":"M.Tech AI"}
]

def create_pdf(resume):
    pdf = FPDF()
    pdf.add_page()

    pdf.set_font("Arial", size=12)

    pdf.cell(200, 10, txt=resume["name"], ln=True)
    pdf.cell(200, 10, txt=resume["role"], ln=True)

    pdf.ln(5)
    pdf.multi_cell(0, 8, txt=f"Skills: {resume['skills']}")
    pdf.multi_cell(0, 8, txt=f"Experience: {resume['experience']}")
    pdf.multi_cell(0, 8, txt=f"Education: {resume['education']}")

    # filename = resume["name"].replace(" ", "_") + ".pdf"
    filename = resume["name"].replace(" ", "_") + "_" + resume["role"].replace(" ", "_") + ".pdf"
    
    file_path = os.path.join(folder_path, filename)
    pdf.output(file_path)


for r in resumes:
    create_pdf(r)