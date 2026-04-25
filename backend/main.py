print(" THIS FILE IS RUNNING ")

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import shutil
import os
import uuid
from datetime import datetime
from backend.pipeline import run_pipeline

app = FastAPI()


# origins = [
#     "http://localhost:5173",
# ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["origins"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "data")

os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload_files/")
async def upload_files(files: List[UploadFile] = File(...)):
    print("API HIT")

    # ✅ Create timestamp + unique session ID
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    unique_id = str(uuid.uuid4())[:8]

    session_id = f"{timestamp}_{unique_id}"

    # ✅ Create session folder
    session_path = os.path.join(UPLOAD_DIR, session_id)
    os.makedirs(session_path, exist_ok=True)

    # ✅ Save files inside session folder
    for file in files:
        file_path = os.path.join(session_path, file.filename)
        print("Saving to:", file_path)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    return {
        "message": "Files uploaded successfully",
        "session_id": session_id
    }
    
    
from pydantic import BaseModel

class RankRequest(BaseModel):
    session_id: str
    job_description: str

@app.post("/rank")
def rank_resumes(data: RankRequest):
    print("RANK API HIT")

    session_path = os.path.join(UPLOAD_DIR, data.session_id)
    results = run_pipeline(session_path, data.job_description)

    return {"ranking": results}
