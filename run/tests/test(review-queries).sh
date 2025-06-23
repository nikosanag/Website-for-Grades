#!/bin/bash

API_URL="http://localhost:3005/api"
LOGIN_URL="http://localhost:3001/api/login"
HEADER="Content-Type: application/json"

extract_token() {
  echo "$1" | jq -r '.token'
}

random_student_id() {
  echo $((3184600 + RANDOM % 30))
}

random_teacher_id() {
  if (( RANDOM % 3 == 0 )); then
    echo "1"
  else
    echo "T$((100 + RANDOM % 900))"
  fi
}

echo "🔐 Logging in as student (3184620)..."
STUDENT_LOGIN=$(curl -s -X POST "$LOGIN_URL" -H "$HEADER" \
  -d '{"identifier": "paskourophobic", "password": "ilovepaskour"}')
STUDENT_TOKEN=$(extract_token "$STUDENT_LOGIN")

echo -e "\n🎓 Submitting 10 reviews as student (3184620)..."
for i in {1..10}; do
  TID=$(random_teacher_id)
  COMMENT="Μαθητής σχολιάζει για καθηγητή $TID - σχόλιο $i"
  RESPONSE=$(curl -s -w "\nHTTP %{http_code}" -X POST "$API_URL/postReview" \
    -H "$HEADER" \
    -H "x-observatory-auth: $STUDENT_TOKEN" \
    -d "{
      \"professorName\": \"Καθηγητής $TID\",
      \"professorId\": \"$TID\",
      \"studentName\": \"paskourophobic\",
      \"studentId\": \"3184620\",
      \"period\": \"2024-2025\",
      \"classSection\": \"Β1\",
      \"gradingScale\": \"0-10\",
      \"originalGrade\": 7,
      \"reviewStatus\": \"Απαντήθηκε από μαθητή\",
      \"newGrade\": 8,
      \"comment\": \"$COMMENT\"
    }")
  echo -e "\n📝 Student review $i response:\n$RESPONSE"
done

echo "🔐 Logging in as teacher (id: 1)..."
TEACHER_LOGIN=$(curl -s -X POST "$LOGIN_URL" -H "$HEADER" \
  -d '{"identifier": "ioanth12", "password": "asdf1234"}')
TEACHER_TOKEN=$(extract_token "$TEACHER_LOGIN")

echo -e "\n👨‍🏫 Submitting reviews as teacher (id: 1) for random students..."
for i in {1..5}; do
  SID=$(random_student_id)
  COMMENT="Καθηγητής 1 σχολιάζει τον φοιτητή $SID"
  RESPONSE=$(curl -s -w "\nHTTP %{http_code}" -X POST "$API_URL/postReview" \
    -H "$HEADER" \
    -H "x-observatory-auth: $TEACHER_TOKEN" \
    -d "{
      \"professorName\": \"ioanth12\",
      \"professorId\": \"1\",
      \"studentName\": \"Student$SID\",
      \"studentId\": \"$SID\",
      \"period\": \"2024-2025\",
      \"classSection\": \"Β2\",
      \"gradingScale\": \"0-10\",
      \"originalGrade\": 6,
      \"reviewStatus\": \"Απαντήθηκε από διδάσκοντα\",
      \"newGrade\": 7,
      \"comment\": \"$COMMENT\"
    }")
  echo -e "\n✏️ Teacher review $i response:\n$RESPONSE"
done

echo -e "\n📥 Fetching reviews as student (3184620)"
curl -s -X GET "$API_URL/viewStudentReviews" \
  -H "$HEADER" \
  -H "x-observatory-auth: $STUDENT_TOKEN" | jq

echo -e "\n📥 Fetching reviews as teacher (id: 1)"
curl -s -X GET "$API_URL/viewInstructorReviews" \
  -H "$HEADER" \
  -H "x-observatory-auth: $TEACHER_TOKEN" | jq

echo -e "\n✅ All done."
