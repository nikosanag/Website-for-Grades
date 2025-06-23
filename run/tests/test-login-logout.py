#!/usr/bin/env python3

import requests
import json

BASE_URL = "http://localhost:3001"
LOGIN_URL = f"{BASE_URL}/api/login"
LOGOUT_URL = f"{BASE_URL}/api/logout"
PROTECTED_URL = f"{BASE_URL}/test/protected"
HEADERS = {"Content-Type": "application/json"}

def print_response(resp, description):
    print(f"🔁 HTTP {resp.status_code}")
    try:
        body = resp.json()
        print(f"📦 Response: {json.dumps(body, indent=2, ensure_ascii=False)}")
    except:
        print(f"📦 Raw Response: {resp.text}")
    return resp.status_code, resp.text

def login(identifier, password):
    print(f"\n🔍 Logging in as {identifier}")
    resp = requests.post(LOGIN_URL, headers=HEADERS, json={
        "identifier": identifier,
        "password": password
    })
    code, body = print_response(resp, "Login")
    token = resp.json().get("token") if resp.ok else None
    if not token:
        print("❌ Login failed")
        exit(1)
    print("✅ Login succeeded")
    return token

def check_protected(token=None, expect=200):
    print(f"\n🔍 Accessing protected route {'with' if token else 'without'} token")
    headers = {"x-observatory-auth": token} if token else {}
    resp = requests.get(PROTECTED_URL, headers=headers)
    code, _ = print_response(resp, "Protected")
    if code == expect:
        print(f"✅ Access {'granted' if expect == 200 else 'denied'} as expected")
    else:
        print(f"❌ Unexpected response code: {code}")
        exit(1)

def logout(token):
    print("\n🚪 Logging out")
    headers = {"x-observatory-auth": token}
    resp = requests.post(LOGOUT_URL, headers=headers)
    code, body = print_response(resp, "Logout")
    try:
        msg = resp.json().get("message")
    except:
        msg = None
    if code == 200 and msg == "Logged out successfully":
        print("✅ Logout successful")
    else:
        print("❌ Logout failed")
        exit(1)

# ---- Begin Tests ----
check_protected(expect=401)  # Test 0

token = login("paskourophobic", "ilovepaskour")  # Test 1
check_protected(token=token, expect=200)         # Test 2

logout(token)                                    # Test 3
check_protected(token=token, expect=403)         # Test 4

new_token = login("paskourophobic", "ilovepaskour")  # Test 5
check_protected(token=new_token, expect=200)

print("\n🎉 All tests completed successfully!")
