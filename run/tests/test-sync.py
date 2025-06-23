#!/usr/bin/env python3

import requests
import json
import time

LOGIN_URL = "http://localhost:3001/api/login"
REGISTER_URL = "http://localhost:3004/api/register"

TEACHER_ID = "ioanth12"
TEACHER_PASS = "asdf1234"

USER_ROLE = "Instructor"
USER_USERNAME = "user1"
USER_PASSWORD = "userpass123"
USER_ID = 21

def pretty_print(response):
    try:
        print(json.dumps(response.json(), indent=2))
    except json.JSONDecodeError:
        print("❌ Failed to decode response as JSON.")
        print(response.text)

print(f"\n🔍 Step 1: Try login as {USER_USERNAME} (should fail)...")
response = requests.post(LOGIN_URL, json={
    "identifier": USER_USERNAME,
    "password": USER_PASSWORD
})
pretty_print(response)
print("\n✅ Expected failure above.")

print("\n🔐 Step 2: Login as teacher...")
response = requests.post(LOGIN_URL, json={
    "identifier": TEACHER_ID,
    "password": TEACHER_PASS
})

try:
    token = response.json().get("token")
except json.JSONDecodeError:
    token = None

if not token:
    print("❌ Failed to get teacher token.")
    exit(1)

print(f"✅ Got token: {token}")

print("\n🧾 Step 3: Registering new user...")
response = requests.post(REGISTER_URL,
    headers={"x-observatory-auth": token},
    json={
        "role": USER_ROLE,
        "username": USER_USERNAME,
        "password": USER_PASSWORD,
        "id": USER_ID
    }
)
pretty_print(response)

time.sleep(10)

print(f"\n🔐 Step 4: Login again as {USER_USERNAME}...")
response = requests.post(LOGIN_URL, json={
    "identifier": USER_USERNAME,
    "password": USER_PASSWORD
})
pretty_print(response)

print("\n✅ If token appears above, full test passed.")
