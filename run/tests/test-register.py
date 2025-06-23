#!/usr/bin/env python3

import requests
import json

# Config
LOGIN_URL = "http://localhost:3001/api/login"
BASE_API_URL = "http://localhost:3004/api"
HEADERS = {"Content-Type": "application/json"}

# Teacher credentials
IDENTIFIER = "mits"
PASSWORD = "mits"

# New user to register
NEW_USER = {
    "role": "Instructor",
    "username": "newuser1",
    "password": "userpass123",
    "id": 4
}

# Data for registering user with random id (no id provided)
NEW_USER_RANDOM_ID = {
    "role": "Student",
    "username": "newstudent1",
    "password": "studentpass123"
}

# Data for updating password
UPDATE_PASSWORD_DATA = {
    "role": "Instructor",
    "username": "newuser1",
    "password": "newpass456"
}

def post_with_auth(endpoint, token, data):
    url = f"{BASE_API_URL}/{endpoint}"
    headers = {
        **HEADERS,
        "x-observatory-auth": token
    }
    resp = requests.post(url, headers=headers, json=data)
    print(f"\n🔹 POST {endpoint}")
    try:
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False))
    except Exception:
        print(resp.text)

def main():
    # Step 1: Login as teacher
    print("🔐 Logging in...")

    login_resp = requests.post(LOGIN_URL, headers=HEADERS, json={
        "identifier": IDENTIFIER,
        "password": PASSWORD
    })

    if login_resp.status_code != 200:
        print(f"❌ Login failed with status {login_resp.status_code}: {login_resp.text}")
        return

    try:
        token = login_resp.json().get("token")
    except Exception:
        token = None

    if not token or token == "null":
        print("❌ Failed to login or get token")
        return

    print("✅ Login successful.")

    # Step 2: Register new user with specified ID
    post_with_auth("register", token, NEW_USER)

    # Step 3: Register new user with random ID
    post_with_auth("register/random", token, NEW_USER_RANDOM_ID)

    # Step 4: Update password for existing user
    post_with_auth("register/update-password", token, UPDATE_PASSWORD_DATA)

if __name__ == "__main__":
    main()
