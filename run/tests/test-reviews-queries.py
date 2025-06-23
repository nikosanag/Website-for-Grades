#!/usr/bin/env python3

import requests
import json
import random

API_URL = "http://localhost:3005/api"
LOGIN_URL = "http://localhost:3001/api/login"
HEADERS = {"Content-Type": "application/json"}

def extract_token(resp):
    try:
        return resp.json().get("token")
    except Exception:
        return None

def random_student_id():
    return str(3184600 + random.randint(0, 29))

def random_teacher_id():
    return "1" if random.randint(0, 2) == 0 else f"T{random.randint(100, 999)}"

def post_review(token, payload):
    headers = {**HEADERS, "x-observatory-auth": token}
    resp = requests.post(f"{API_URL}/postReview", headers=headers, json=payload)
    try:
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False))
    except Exception:
        print(resp.text)
    print(f"HTTP {resp.status_code}\n")

# --- Student login ---
print("🔐 Logging in as student (3184620)...")
student_login = requests.post(LOGIN_URL, headers=HEADERS, json={
    "identifier": "paskourophobic",
    "password": "ilovepaskour"
})
student_token = extract_token(student_login)

# --- Submit reviews as student ---
print("\n🎓 Submitting 10 reviews as student (3184620)...")
for i in range(1, 11):
    tid = random_teacher_id()
    comment = f"Μαθητής σχολιάζει για καθηγητή {tid} - σχόλιο {i}"
    payload = {
        "professorName": f"Καθηγητής {tid}",
        "professorId": tid,
        "studentName": "paskourophobic",
        "studentId": "3184620",
        "period": "2024-2025",
        "classSection": "Β1",
        "gradingScale": "0-10",
        "originalGrade": 7,
        "reviewStatus": "Απαντήθηκε από μαθητή",
        "newGrade": 8,
        "comment": comment
    }
    print(f"\n📝 Student review {i} response:")
    post_review(student_token, payload)

# --- Teacher login ---
print("🔐 Logging in as teacher (id: 1)...")
teacher_login = requests.post(LOGIN_URL, headers=HEADERS, json={
    "identifier": "ioanth12",
    "password": "asdf1234"
})
teacher_token = extract_token(teacher_login)

# --- Submit reviews as teacher ---
print("\n👨‍🏫 Submitting reviews as teacher (id: 1) for random students...")
for i in range(1, 6):
    sid = random_student_id()
    comment = f"Καθηγητής 1 σχολιάζει τον φοιτητή {sid}"
    payload = {
        "professorName": "ioanth12",
        "professorId": "1",
        "studentName": f"Student{sid}",
        "studentId": sid,
        "period": "2024-2025",
        "classSection": "Β2",
        "gradingScale": "0-10",
        "originalGrade": 6,
        "reviewStatus": "Απαντήθηκε από διδάσκοντα",
        "newGrade": 7,
        "comment": comment
    }
    print(f"\n✏️ Teacher review {i} response:")
    post_review(teacher_token, payload)

# --- View student reviews ---
print("\n📥 Fetching reviews as student (3184620)")
resp = requests.get(f"{API_URL}/viewStudentReviews", headers={
    **HEADERS,
    "x-observatory-auth": student_token
})
try:
    print(json.dumps(resp.json(), indent=2, ensure_ascii=False))
except Exception:
    print(resp.text)

# --- View teacher reviews ---
print("\n📥 Fetching reviews as teacher (id: 1)")
resp = requests.get(f"{API_URL}/viewInstructorReviews", headers={
    **HEADERS,
    "x-observatory-auth": teacher_token
})
try:
    print(json.dumps(resp.json(), indent=2, ensure_ascii=False))
except Exception:
    print(resp.text)

print("\n✅ All done.")
