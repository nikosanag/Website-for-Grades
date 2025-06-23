#!/usr/bin/env python3

import requests
import json

BASE_URL = "http://localhost:3008/api"
LOGIN_URL = "http://localhost:3001/api/login"
UPLOAD_URL = f"{BASE_URL}/grades/upload"
STUDENT_GRADES_URL = f"{BASE_URL}/grades/student"
COURSE_GRADES_URL = f"{BASE_URL}/grades/course/3205"
COURSE_GRADES_URL2 = f"{BASE_URL}/grades/course/3206"

HEADERS = {"Content-Type": "application/json"}


def login_and_get_token(identifier, password):
    response = requests.post(LOGIN_URL, headers=HEADERS, json={
        "identifier": identifier,
        "password": password
    })

    try:
        data = response.json()
        print("🔑 Login response:", json.dumps(data, indent=2, ensure_ascii=False))
        return data.get("token")  # Adjust this depending on your response format
    except Exception as e:
        print("Login failed:", response.text)
        return None


def upload_grades(token):
    print("\n⬆️ Uploading grades...")
    grades = [ {'studentId': '3184620', 'fullName': 'ΒΑΣΙΛΕΙΟΥ ΒΑΣΙΛΙΚΗ', 'email': 'el81928@mail.ntua.gr', 'period': '2024-2025 ΧΕΙΜ 2024', 'course': 'gsdfgdfgs (3206)', 'scale': '0-10', 'finalScore': 4, 'breakdown': {'Q01': 6, 'Q02': 2, 'Q03': 4, 'Q04': 8, 'Q05': 9, 'Q06': 8, 'Q07': 4, 'Q08': 5, 'Q09': 6, 'Q10': 7}}, {'studentId': '3181121', 'fullName': 'ΒΑΣΙΛΕΙΟΥ ΔΗΜΗΤΡΗΣ', 'email': 'el81121@mail.ntua.gr', 'period': '2024-2025 ΧΕΙΜ 2024', 'course': 'ΤΕΧΝΟΛΟΓΙΑ ΛΟΓΙΣΜΙΚΟΥ   (3205)', 'scale': '0-10', 'finalScore': 5, 'breakdown': {'Q01': 8, 'Q02': 4, 'Q03': 3, 'Q04': 4, 'Q05': 9, 'Q06': 5, 'Q07': 5, 'Q08': 3, 'Q09': 4, 'Q10': 8}}, {'studentId': '3181489', 'fullName': 'ΠΑΝΑΓΙΩΤΙΔΗΣ ΘΕΟΔΩΡΟΣ', 'email': 'el81489@mail.ntua.gr', 'period': '2024-2025 ΧΕΙΜ 2024', 'course': 'ΤΕΧΝΟΛΟΓΙΑ ΛΟΓΙΣΜΙΚΟΥ   (3205)', 'scale': '0-10', 'finalScore': 4, 'breakdown': {'Q01': 5, 'Q02': 2, 'Q03': 4, 'Q04': 6, 'Q05': 10, 'Q06': 8, 'Q07': 1, 'Q08': 2, 'Q09': 5, 'Q10': 10}}, {'studentId': '3181857', 'fullName': 'ΑΝΔΡΕΟΥ ΠΑΝΑΓΙΩΤΗΣ', 'email': 'el81857@mail.ntua.gr', 'period': '2024-2025 ΧΕΙΜ 2024', 'course': 'ΤΕΧΝΟΛΟΓΙΑ ΛΟΓΙΣΜΙΚΟΥ   (3205)', 'scale': '0-10', 'finalScore': 8, 'breakdown': {'Q01': 6, 'Q02': 10, 'Q03': 3, 'Q04': 3, 'Q05': 10, 'Q06': 6, 'Q07': 10, 'Q08': 2, 'Q09': 5, 'Q10': 9}}, {'studentId': '3184620', 'fullName': 'ΧΑΤΖΗΝΙΚΟΛΑΟΥ ΝΙΚΟΛΑΟΣ', 'email': 'el81110@mail.ntua.gr', 'period': '2024-2025 ΧΕΙΜ 2024', 'course': 'ΤΕΧΝΟΛΟΓΙΑ ΛΟΓΙΣΜΙΚΟΥ   (3205)', 'scale': '0-10', 'finalScore': 5, 'breakdown': {'Q01': 6, 'Q02': 2, 'Q03': 7, 'Q04': 7, 'Q05': 8, 'Q06': 9, 'Q07': 5, 'Q08': 4, 'Q09': 5, 'Q10': 8}}]

    response = requests.post(
        UPLOAD_URL,
        headers={**HEADERS, "x-observatory-auth": token},
        json={"grades": grades}
    )
    print("📤 Upload response:", response.status_code)
    print(response.text)


def get_grades_by_student(token):
    print("\n👤 Fetching grades by student...")
    response = requests.get(
        STUDENT_GRADES_URL,
        headers={**HEADERS, "x-observatory-auth": token}
    )
    print("🎓 Student grades:", response.status_code)
    print(response.text)


def get_grades_by_course(token):
    print("\n📘 Fetching grades by course...")
    response = requests.get(
        COURSE_GRADES_URL,
        headers={**HEADERS, "x-observatory-auth": token}
    )
    print("📚 Course grades:", response.status_code)
    print(response.text)

def get_grades_by_course2(token):
    print("\n📘 Fetching grades by course...")
    response = requests.get(
        COURSE_GRADES_URL2,
        headers={**HEADERS, "x-observatory-auth": token}
    )
    print("📚 Course grades:", response.status_code)
    print(response.text)

# 🔐 Login and get token
token = login_and_get_token("1", "asdf1234")  # Update as needed

# Run tests if token received
if token:
    upload_grades(token)
else:
    print("❌ Could not authenticate")

print("")

token = login_and_get_token("paskourophobic", "ilovepaskour")  # Update as needed

# Run tests if token received
if token:
    get_grades_by_student(token)
else:
    print("❌ Could not authenticate")

print("")

# 🔐 Login and get token
token = login_and_get_token("1", "asdf1234")  # Update as needed

# Run tests if token received
if token:
    get_grades_by_course(token)
else:
    print("❌ Could not authenticate")

# Run tests if token received
if token:
    get_grades_by_course2(token)
else:
    print("❌ Could not authenticate")
