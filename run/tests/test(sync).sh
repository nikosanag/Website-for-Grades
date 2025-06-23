#!/bin/bash

LOGIN_URL="http://localhost:3001/api/login"
REGISTER_URL="http://localhost:3004/api/register"

TEACHER_ID="ioanth12"
TEACHER_PASS="asdf1234"

USER_ROLE="Instructor"
USER_USERNAME="user1"
USER_PASSWORD="userpass123"
USER_ID=21

echo -e "\n🔍 Step 1: Try login as $USER_USERNAME (should fail)..."
curl -s -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"identifier\": \"$USER_USERNAME\", \"password\": \"$USER_PASSWORD\"}" | jq .
echo -e "\n✅ Expected failure above."

echo -e "\n🔐 Step 2: Login as teacher..."
TOKEN=$(curl -s -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"identifier\": \"$TEACHER_ID\", \"password\": \"$TEACHER_PASS\"}" | jq -r '.token')

if [[ -z "$TOKEN" || "$TOKEN" == "null" ]]; then
  echo "❌ Failed to get teacher token."
  exit 1
fi

echo "✅ Got token: $TOKEN"

echo -e "\n🧾 Step 3: Registering new user..."
curl -s -X POST "$REGISTER_URL" \
  -H "Content-Type: application/json" \
  -H "x-observatory-auth: $TOKEN" \
  -d "{\"role\":\"$USER_ROLE\", \"username\":\"$USER_USERNAME\", \"password\":\"$USER_PASSWORD\", \"id\":$USER_ID}" | jq .

sleep 10

echo -e "\n🔐 Step 4: Login again as $USER_USERNAME..."
curl -s -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"identifier\": \"$USER_USERNAME\", \"password\": \"$USER_PASSWORD\"}" | jq .

echo -e "\n✅ If token appears above, full test passed."
