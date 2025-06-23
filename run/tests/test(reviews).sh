#!/bin/bash

API_URL="http://localhost:3005/api/postReview"
LOGIN_URL="http://localhost:3001/api/login"
HEADER="Content-Type: application/json"

# Helper to parse token
extract_token() {
    echo "$1" | jq -r '.token'
}

# Sample review data (same review to test update)
REVIEW_PAYLOAD='{
  "professorName": "Γιάννης Παπαδόπουλος",
  "professorId": "T123",
  "studentName": "Μαρία Νικολάου",
  "studentId": "S456",
  "period": "2024-2025",
  "classSection": "Β1",
  "gradingScale": "0-10",
  "originalGrade": 7,
  "reviewStatus": "Δημιουργήθηκε αίτηση",
  "newGrade": 7,
  "comment": "Αρχικό σχόλιο από μαθητή"
}'

echo -e "\n🚫 Test 0: Try posting review WITHOUT token (should fail)"
curl -s -w "\nHTTP %{http_code}\n" -X POST "$API_URL" \
  -H "$HEADER" \
  -d "$REVIEW_PAYLOAD"

# Student login (paskourophobic)
STUDENT_LOGIN=$(curl -s -X POST "$LOGIN_URL" -H "$HEADER" \
  -d '{"identifier": "paskourophobic", "password": "ilovepaskour"}')

STUDENT_TOKEN=$(extract_token "$STUDENT_LOGIN")
echo "Token: $STUDENT_TOKEN"

echo -e "\n📝 Test 2: Post review as STUDENT"
curl -s -w "\nHTTP %{http_code}\n" -X POST "$API_URL" \
  -H "$HEADER" \
  -H "x-observatory-auth: $STUDENT_TOKEN" \
  -d "$REVIEW_PAYLOAD"

# Professor login (ioanth12)
PROF_LOGIN=$(curl -s -X POST "$LOGIN_URL" -H "$HEADER" \
  -d '{"identifier": "ioanth12", "password": "asdf1234"}')

PROF_TOKEN=$(extract_token "$PROF_LOGIN")
echo "Token: $PROF_TOKEN"

echo -e "\n✏️ Test 4: Professor updates existing review"
REVIEW_UPDATE='{
  "professorName": "Γιάννης Παπαδόπουλος",
  "professorId": "T123",
  "studentName": "Μαρία Νικολάου",
  "studentId": "S456",
  "period": "2024-2025",
  "classSection": "Β1",
  "gradingScale": "0-10",
  "originalGrade": 7,
  "reviewStatus": "Απαντήθηκε από διδάσκοντα",
  "newGrade": 9,
  "comment": "Ο καθηγητής επανεξέτασε την εργασία."
}'

curl -s -w "\nHTTP %{http_code}\n" -X POST "$API_URL" \
  -H "$HEADER" \
  -H "x-observatory-auth: $PROF_TOKEN" \
  -d "$REVIEW_UPDATE"

echo -e "\n✅ Done."
