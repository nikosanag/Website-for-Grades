#!/usr/bin/env python3

import requests
import json
import csv

# Config
LOGIN_URL = "http://localhost:3001/api/login"
BASE_API_URL = "http://localhost:3004/api"
HEADERS = {"Content-Type": "application/json"}

# Credentials για login (Representative)
IDENTIFIER = "mits"
PASSWORD = "mits"

def post_with_auth(endpoint, token, data):
    url = f"{BASE_API_URL}/{endpoint}"
    headers = {
        **HEADERS,
        "x-observatory-auth": token
    }
    resp = requests.post(url, headers=headers, json=data)
    print(f"\n🔹 POST {endpoint} για χρήστη '{data.get('username')}'")
    try:
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False))
    except Exception:
        print(resp.text)

def login():
    print("🔐 Logging in...")
    login_resp = requests.post(LOGIN_URL, headers=HEADERS, json={
        "identifier": IDENTIFIER,
        "password": PASSWORD
    })

    if login_resp.status_code != 200:
        print(f"❌ Login failed: {login_resp.text}")
        return None

    try:
        token = login_resp.json().get("token")
    except Exception:
        token = None

    if not token:
        print("❌ Failed to retrieve token")
        return None

    print("✅ Login successful.")
    return token

def insert_users_from_csv(filename, token):
    with open(filename, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            student_id = row.get("id", "").strip()
            has_id = student_id != ""
            try:
                data = {
                    "role": row["role"].strip(),
                    "username": row["username"].strip(),
                    "password": row["password"].strip()
                }
                if has_id:
                    data["id"] = int(student_id)
                    post_with_auth("register", token, data)
                else:
                    post_with_auth("register/random", token, data)
            except Exception as e:
                print(f"❌ Error with row: {row} → {e}")

def main():
    token = login()
    if not token:
        return

    insert_users_from_csv("./data/users.csv", token)

if __name__ == "__main__":
    main()
