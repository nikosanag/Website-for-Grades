#!/usr/bin/env python3

import requests
import json

BASE_URL = "http://localhost:3008/api"
LOGIN_URL = "http://localhost:3001/api/login"
UPLOAD_URL = f"{BASE_URL}/grades/upload"

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

    # ✅ Load grades from file
    try:
        with open("./data/grades.json", "r", encoding="utf-8") as f:
            grades = json.load(f)
    except Exception as e:
        print("❌ Failed to load grades.json:", e)
        return

    response = requests.post(
        UPLOAD_URL,
        headers={**HEADERS, "x-observatory-auth": token},
        json={"grades": grades}
    )

    print("📤 Upload response:", response.status_code)
    print(response.text)


# 🔐 Login and get token
token = login_and_get_token("1", "asdf1234")  # Update as needed

# Run tests if token received
if token:
    upload_grades(token)
else:
    print("❌ Could not authenticate")
