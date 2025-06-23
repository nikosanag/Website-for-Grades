#!/bin/bash

API_URL="http://localhost:3001/api/login"
HEADER="Content-Type: application/json"

echo -e "\n🔍 Test 1: Valid login with username"
curl -s -X POST "$API_URL" -H "$HEADER" -d '{"identifier": "paskourophobic", "password": "ilovepaskour"}'
echo -e "\n---"

echo -e "\n🔍 Test 2: Valid login with id"
curl -s -X POST "$API_URL" -H "$HEADER" -d '{"identifier": "1", "password": "asdf1234"}'
echo -e "\n---"

echo -e "\n❌ Test 3: Invalid login (wrong password)"
curl -s -X POST "$API_URL" -H "$HEADER" -d '{"identifier": "paskourophobic", "password": "wrongpass"}'
echo -e "\n---"
