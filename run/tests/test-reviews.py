#!/usr/bin/env python3

import requests
import json

API_URL = "http://localhost:3005/api/postReview"
LOGIN_URL = "http://localhost:3001/api/login"
HEADERS = {"Content-Type": "application/json"}

# Helper to pretty print responses
def pretty_response(resp):
    try:
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False))
    except Exception:
        print(resp.text)
    print(f"HTTP {resp.status_code}")

# Helper to get token
def extract_token(login_response):
    try:
        return login_response.json().get("token")
    except Exception:
        return None

REVIEW_PAYLOAD = {
    "professorName": "Γιάννης Παπαδόπουλος",
    "professorId": "T123",
    "studentName": "Μαρία Νικολάου",
    "studentId": "S456",
    "period": "2024-2025",
    "classSection": "Β1",
    "gradingScale": "0-10",
    "originalGrade": 7,
    "reviewStatus": "Δημιουργήθηκε αίτηση",
    "newGrade": 7,
    "comment": "Αρχικό σχόλιο από μαθητή"
}

print("\n🚫 Test 0: Try posting review WITHOUT token (should fail)")
resp = requests.post(API_URL, headers=HEADERS, json=REVIEW_PAYLOAD)
pretty_response(resp)

# Student login
print("\n🔐 Logging in as student (paskourophobic)...")
student_resp = requests.post(LOGIN_URL, headers=HEADERS, json={
    "identifier": "paskourophobic",
    "password": "ilovepaskour"
})
student_token = extract_token(student_resp)
print(f"Token: {student_token}")

print("\n📝 Test 2: Post review as STUDENT")
resp = requests.post(API_URL, headers={
    **HEADERS,
    "x-observatory-auth": student_token
}, json=REVIEW_PAYLOAD)
pretty_response(resp)

# Professor login
print("\n🔐 Logging in as professor (ioanth12)...")
prof_resp = requests.post(LOGIN_URL, headers=HEADERS, json={
    "identifier": "ioanth12",
    "password": "asdf1234"
})
prof_token = extract_token(prof_resp)
print(f"Token: {prof_token}")

print("\n✏️ Test 4: Professor updates existing review")
REVIEW_UPDATE = {
    "professorName": "Γιάννης Παπαδόπουλος",
    "professorId": "T123",
    "studentName": "Μαρία Νικολάου",
    "studentId": "S456",
    "period": "2024-2025",
    "classSection": "Β1",
    "gradingScale": "0-10",
    "originalGrade": 7,
    "reviewStatus": "Απαντήθηκε από διδάσκοντα",
    "newGrade": 9,
    "comment": "Ο καθηγητής επανεξέτασε την εργασία."
}

resp = requests.post(API_URL, headers={
    **HEADERS,
    "x-observatory-auth": prof_token
}, json=REVIEW_UPDATE)
pretty_response(resp)

print("\n✅ Done.")
