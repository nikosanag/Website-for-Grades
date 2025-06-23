from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import numpy as np
from datetime import date

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

def process_excel(contents: bytes, status: str):
    raw_df = pd.read_excel(io.BytesIO(contents), header=None)

    # Step 1: Detect header row
    header_row_index = raw_df[raw_df.apply(lambda row: row.astype(str).str.contains("Αριθμός Μητρώου").any(), axis=1)].index
    if header_row_index.empty:
        return JSONResponse(status_code=400, content={"error": "Header row not found in file"})

    header_row = header_row_index[0]

    # Step 2: Read again using that row as header
    df = pd.read_excel(io.BytesIO(contents), header=header_row)

    # Step 3: Remove unwanted 'Unnamed' columns
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

    # Step 4: Clean up NaN/infinite values
    df = df.dropna(how="all")
    df = df.replace({np.nan: None, np.inf: None, -np.inf: None})

    # Step 5: Transform records
    result = []
    today = date.today().isoformat()
    for _, row in df.iterrows():
        record = row.to_dict()

        breakdown = {k: record[k] for k in record if str(k).strip().upper().startswith("Q") and record[k] is not None}
        for k in breakdown:
            record.pop(k, None)
        if breakdown:
            record["breakdown"] = breakdown

        record = {
            "studentId": str(record.get("Αριθμός Μητρώου", "")).strip(),
            "fullName": record.get("Ονοματεπώνυμο", "").strip(),
            "email": record.get("Ακαδημαϊκό E-mail", "").strip(),
            "period": record.get("Περίοδος δήλωσης", "").strip(),
            "course": record.get("Τμήμα Τάξης", "").strip(),
            "scale": record.get("Κλίμακα βαθμολόγησης", "").strip(),
            "finalScore": record.get("Βαθμολογία"),
            "breakdown": breakdown,
            "status": status,
            "date": today
        }

        result.append(record)

    return JSONResponse(content=result)

@app.post("/api/grades/uploadXlsxOpen")
async def upload_excel_open(file: UploadFile = File(...)):
    if not file.filename.endswith('.xlsx'):
        return JSONResponse(status_code=400, content={"error": "Only .xlsx files are supported"})
    contents = await file.read()
    return process_excel(contents, status="open")

@app.post("/api/grades/uploadXlsxClosed")
async def upload_excel_closed(file: UploadFile = File(...)):
    if not file.filename.endswith('.xlsx'):
        return JSONResponse(status_code=400, content={"error": "Only .xlsx files are supported"})
    contents = await file.read()
    return process_excel(contents, status="closed")
