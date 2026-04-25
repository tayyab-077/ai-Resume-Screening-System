import fitz  # PyMuPDF

def extract_text_from_pdf(file_path):
    """
    Extracts raw text from a PDF resume.

    Why:
    - Resumes are uploaded as PDFs
    - We need clean text before applying NLP models
    """
    

    text = ""
    doc = fitz.open(file_path)

    for page in doc:
        text += page.get_text()

    doc.close()  # ✅ important

    return text
