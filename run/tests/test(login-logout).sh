#!/bin/bash

API_URL="http://localhost:3001/api/login"
HEADER="Content-Type: application/json"
BASE_URL="http://localhost:3001"

parse_response() {
    local response="$1"
    echo "$response" | head -n1
}

parse_code() {
    local response="$1"
    echo "$response" | tail -n1
}

echo -e "\n🔍 Test 0: Access protected route BEFORE login (should be denied)"
PROTECTED_BEFORE=$(curl -s -w "\n%{http_code}" "$BASE_URL/test/protected")
PROTECTED_BODY_BEFORE=$(parse_response "$PROTECTED_BEFORE")
PROTECTED_CODE_BEFORE=$(parse_code "$PROTECTED_BEFORE")
echo "🔁 HTTP $PROTECTED_CODE_BEFORE"
echo "📦 Response: $PROTECTED_BODY_BEFORE"
if [ "$PROTECTED_CODE_BEFORE" -eq 401 ] || [ "$PROTECTED_CODE_BEFORE" -eq 403 ]; then
    echo "✅ Access denied before login (expected)"
else
    echo "❌ Unexpected access granted before login"
    exit 1
fi

echo -e "\n🔍 Test 1: Valid login with username"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" -H "$HEADER" \
  -d '{"identifier": "paskourophobic", "password": "ilovepaskour"}')
HTTP_BODY=$(parse_response "$LOGIN_RESPONSE")
HTTP_CODE=$(parse_code "$LOGIN_RESPONSE")
echo "🔁 HTTP $HTTP_CODE"
echo "📦 Response: $HTTP_BODY"
TOKEN=$(echo "$HTTP_BODY" | jq -r '.token')
if [[ "$HTTP_CODE" == "200" && "$TOKEN" != "null" && -n "$TOKEN" ]]; then
    echo "✅ Login succeeded"
else
    echo "❌ Login failed"
    exit 1
fi

echo -e "\n🔍 Test 2: Access protected route with valid token"
PROTECTED_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/test/protected" -H "x-observatory-auth: $TOKEN")
PROTECTED_BODY=$(parse_response "$PROTECTED_RESPONSE")
PROTECTED_CODE=$(parse_code "$PROTECTED_RESPONSE")
echo "🔁 HTTP $PROTECTED_CODE"
echo "📦 Response: $PROTECTED_BODY"
if [ "$PROTECTED_CODE" -eq 200 ]; then
    echo "✅ Access granted with valid token"
else
    echo "❌ Access denied with valid token"
    exit 1
fi

echo -e "\n🚪 Test 3: Logging out (invalidate token)"
LOGOUT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/logout" -H "x-observatory-auth: $TOKEN")
LOGOUT_BODY=$(parse_response "$LOGOUT_RESPONSE")
LOGOUT_CODE=$(parse_code "$LOGOUT_RESPONSE")
echo "🔁 HTTP $LOGOUT_CODE"
echo "📦 Response: $LOGOUT_BODY"
if [[ "$LOGOUT_CODE" == "200" && $(echo "$LOGOUT_BODY" | jq -r '.message') == "Logged out successfully" ]]; then
    echo "✅ Logout successful"
else
    echo "❌ Logout failed"
    exit 1
fi

echo -e "\n🔍 Test 4: Access protected route with BLACKLISTED token"
PROTECTED_BLACKLISTED=$(curl -s -w "\n%{http_code}" "$BASE_URL/test/protected" -H "x-observatory-auth: $TOKEN")
PROTECTED_BODY_BLACKLISTED=$(parse_response "$PROTECTED_BLACKLISTED")
PROTECTED_CODE_BLACKLISTED=$(parse_code "$PROTECTED_BLACKLISTED")
echo "🔁 HTTP $PROTECTED_CODE_BLACKLISTED"
echo "📦 Response: $PROTECTED_BODY_BLACKLISTED"
if [ "$PROTECTED_CODE_BLACKLISTED" -eq 403 ]; then
    echo "✅ Access denied with blacklisted token (expected)"
else
    echo "❌ Unexpected access granted with blacklisted token"
    exit 1
fi

echo -e "\n🔍 Test 5: Login again and access protected route"
NEW_LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" -H "$HEADER" \
  -d '{"identifier": "paskourophobic", "password": "ilovepaskour"}')
NEW_BODY=$(parse_response "$NEW_LOGIN_RESPONSE")
NEW_CODE=$(parse_code "$NEW_LOGIN_RESPONSE")
echo "🔁 HTTP $NEW_CODE"
echo "📦 Response: $NEW_BODY"
NEW_TOKEN=$(echo "$NEW_BODY" | jq -r '.token')
if [[ "$NEW_CODE" == "200" && "$NEW_TOKEN" != "null" && -n "$NEW_TOKEN" ]]; then
    echo "✅ New login succeeded"
else
    echo "❌ New login failed"
    exit 1
fi

PROTECTED_RESPONSE_NEW=$(curl -s -w "\n%{http_code}" "$BASE_URL/test/protected" -H "x-observatory-auth: $NEW_TOKEN")
PROTECTED_BODY_NEW=$(parse_response "$PROTECTED_RESPONSE_NEW")
PROTECTED_CODE_NEW=$(parse_code "$PROTECTED_RESPONSE_NEW")
echo "🔁 HTTP $PROTECTED_CODE_NEW"
echo "📦 Response: $PROTECTED_BODY_NEW"
if [ "$PROTECTED_CODE_NEW" -eq 200 ]; then
    echo "✅ Access granted with new valid token"
else
    echo "❌ Access denied with new valid token"
    exit 1
fi

echo -e "\n🎉 All tests completed successfully!"
