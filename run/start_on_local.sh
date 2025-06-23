#!/bin/bash

python3 ./utils/move_to_local_network.py

set -e

echo "🐳 Building Docker containers..."
docker-compose build

echo "🚀 Starting services with Docker Compose..."
docker-compose up -d

echo "⏳ Waiting for MongoDB to initialize..."
sleep 30

# Config
MONGO_CONTAINER="user-management-database"
DB_NAME="userdb"
COLLECTION="users"

# Bcrypt hashed password (example for 'mits')
HASHED_PASSWORD='$2b$10$xx.UkWuctZYj/Pd5Gyqkn.xYlHuqlUpGhqSN1Smc9.mfdb9RqbDpy'

# JS command to insert Representative user
JS_COMMAND="
db = db.getSiblingDB('$DB_NAME');
db.$COLLECTION.insertOne({
  id: 111,
  role: 'Representative',
  username: 'mits',
  password: '$HASHED_PASSWORD'
});
"

# Execute in MongoDB container
echo "🔄 Inserting user into MongoDB container..."
docker exec -i "$MONGO_CONTAINER" mongosh --quiet --eval "$JS_COMMAND"

# Config
MONGO_CONTAINER="login-database"
DB_NAME="logindb"
COLLECTION="users"

# Bcrypt hashed password (example for 'mits')
HASHED_PASSWORD='$2b$10$xx.UkWuctZYj/Pd5Gyqkn.xYlHuqlUpGhqSN1Smc9.mfdb9RqbDpy'

# JS command to insert Representative user
JS_COMMAND="
db = db.getSiblingDB('$DB_NAME');
db.$COLLECTION.insertOne({
  id: 111,
  role: 'Representative',
  username: 'mits',
  password: '$HASHED_PASSWORD'
});
"

# Execute in MongoDB container
echo "🔄 Inserting user into MongoDB container..."
docker exec -i "$MONGO_CONTAINER" mongosh --quiet --eval "$JS_COMMAND"

echo "✅ User inserted successfully."

python3 ./utils/upload_users.py

##### GRADES
python3 ./utils/upload_grades.py

##### FINISH


##### FINISH

echo ""
echo "✅ All services are up and running!"
