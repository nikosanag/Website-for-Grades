#!/usr/bin/env python3

import requests
import json

API_URL = "http://localhost:3001/api/login"
HEADERS = {"Content-Type": "application/json"}

def test_login(test_name, identifier, password):
    print(f"\n🔍 {test_name}")
    response = requests.post(API_URL, headers=HEADERS, json={
        "identifier": identifier,
        "password": password
    })
    try:
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    except Exception:
        print(response.text)
    print("---")

# Test 1: Valid login with username
test_login("Test 1: Valid login with username", "paskourophobic", "ilovepaskour")

# Test 2: Valid login with id
test_login("Test 2: Valid login with id", "1", "asdf1234")

# Test 3: Invalid login (wrong password)
test_login("Test 3: Invalid login (wrong password)", "paskourophobic", "wrongpass")
