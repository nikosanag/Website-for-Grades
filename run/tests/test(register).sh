#!/bin/bash

# Config
LOGIN_URL="http://localhost:3001/api/login"
REGISTER_URL="http://localhost:3004/api/register"

# Teacher credentials from your screenshot
IDENTIFIER="ioanth12"
PASSWORD="asdf1234"

# New user data to register
NEW_USER_ROLE="Instructor"
NEW_USER_USERNAME="newuser1"
NEW_USER_PASSWORD="userpass123"
NEW_USER_ID=2

# Step 1: Login as teacher and get token
echo "Logging in as teacher..."

TOKEN=$(curl -s -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"$IDENTIFIER\", \"password\":\"$PASSWORD\"}" | jq -r '.token')

echo "Received token: $TOKEN"

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Failed to login or get token"
  exit 1
fi

echo "✅ Logged in! Token received."

# Step 2: Register new user with token
echo "Registering new user..."

RESPONSE=$(curl -s -X POST "$REGISTER_URL" \
  -H "Content-Type: application/json" \
  -H "x-observatory-auth: $TOKEN" \
  -d "{\"role\":\"$NEW_USER_ROLE\", \"username\":\"$NEW_USER_USERNAME\", \"password\":\"$NEW_USER_PASSWORD\", \"id\":$NEW_USER_ID}")

echo "Response from register endpoint:"
echo "$RESPONSE"
