#!/usr/bin/env python3

import requests
import json

API_URL = "http://localhost:3001/api/login"
BASE_URL = "http://localhost:3008"
HEADERS = {"Content-Type": "application/json"}

def get_token(identifier, password):
    response = requests.post(API_URL, headers=HEADERS, json={
        "identifier": identifier,
        "password": password
    })
    try:
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
        return data.get("token")
    except Exception:
        print(response.text)
        return None

def test_courses(token):
    url = f"{BASE_URL}/api/student/courses"
    auth_headers = {
        **HEADERS,
        "x-observatory-auth": token
    }

    try:
        response = requests.get(url, headers=auth_headers)
        response.raise_for_status()
        print(json.dumps(response.json(), ensure_ascii=False, indent=2))
    except requests.exceptions.RequestException as err:
        print(f"❌ Request failed: {err}")
    except json.JSONDecodeError:
        print("❌ Failed to decode JSON response.")

def test_courses2(token):
    url = f"{BASE_URL}/api/grades/student/3206"
    auth_headers = {
        **HEADERS,
        "x-observatory-auth": token
    }

    try:
        response = requests.get(url, headers=auth_headers)
        response.raise_for_status()
        print(json.dumps(response.json(), ensure_ascii=False, indent=2))
    except requests.exceptions.RequestException as err:
        print(f"❌ Request failed: {err}")
    except json.JSONDecodeError:
        print("❌ Failed to decode JSON response.")

if __name__ == "__main__":
    print("\n🔐 Logging in...")
    token = get_token("karag1", "vguwds")

    if token:
        test_courses(token)
    else:
        print("❌ Failed to authenticate.")

    if token:
        test_courses2(token)
    else:
        print("❌ Failed to authenticate.")
    print("\n🔐 Logging in...")
    token = get_token("ioanth12", "asdf1234")

    if token:
        test_courses(token)
    else:
        print("❌ Failed to authenticate.")
