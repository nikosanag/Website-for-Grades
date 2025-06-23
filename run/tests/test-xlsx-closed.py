import requests
import os
import json

# === First XLSX Upload ===

file_path = "./data/grade-simple.xlsx"
url = "http://localhost:8000/api/grades/uploadXlsxClosed"

if not os.path.isfile(file_path):
    print(f"❌ Error: File not found at {file_path}")
    exit(1)

with open(file_path, "rb") as f:
    files = {
        "file": ("grade-simple.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    }
    response = requests.post(url, files=files)

print("📤 First Upload Status Code:", response.status_code)
try:
    print("📥 First Response JSON:", response.json())
except Exception as e:
    print("❌ Failed to parse first response JSON:", e)
    print("Raw Response:", response.text)

# === Second XLSX Upload ===

file_path = "./data/grades_detailed3.xlsx"

if not os.path.isfile(file_path):
    print(f"❌ Error: File not found at {file_path}")
    exit(1)

with open(file_path, "rb") as f:
    files = {
        "file": ("grades_detailed3.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    }
    response = requests.post(url, files=files)

print("📤 Second Upload Status Code:", response.status_code)

try:
    json_data = response.json()
    print("📥 Second Response JSON parsed successfully.")

    # Save to grades.json
    with open("grades.json", "w", encoding="utf-8") as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    print("✅ Response saved to grades.json")

except Exception as e:
    print("❌ Failed to parse second response JSON:", e)
    print("Raw Response:", response.text)
