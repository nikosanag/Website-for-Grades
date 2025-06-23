@echo off
setlocal enabledelayedexpansion

python ./utils/move_to_local_network.py

:: === Docker Compose ===
echo 🐳 Building Docker containers...
docker compose build

echo 🚀 Starting services with Docker Compose...
docker compose up -d

:: === Wait for MongoDB ===
echo ⏳ Waiting for MongoDB to initialize...
timeout /t 30 >nul

:: === Insert Representative User ===
set "REP_ID=111"
set "REP_ROLE=Representative"
set "REP_USERNAME=mits"
set "REP_PASSWORD_HASH=$2b$10$xx.UkWuctZYj/Pd5Gyqkn.xYlHuqlUpGhqSN1Smc9.mfdb9RqbDpy"

:: === Insert into user-management-database ===
set "MONGO_CONTAINER=user-management-database"
set "DB_NAME=userdb"
set "COLLECTION=users"

echo 🔄 Inserting user into MongoDB container [%MONGO_CONTAINER%]...
docker exec -i %MONGO_CONTAINER% mongosh --quiet --eval ^
"db = db.getSiblingDB('%DB_NAME%'); db.%COLLECTION%.insertOne({id: %REP_ID%, role: '%REP_ROLE%', username: '%REP_USERNAME%', password: '%REP_PASSWORD_HASH%'});"

:: === Insert into login-database ===
set "MONGO_CONTAINER=login-database"
set "DB_NAME=logindb"
set "COLLECTION=users"

echo 🔄 Inserting user into MongoDB container [%MONGO_CONTAINER%]...
docker exec -i %MONGO_CONTAINER% mongosh --quiet --eval ^
"db = db.getSiblingDB('%DB_NAME%'); db.%COLLECTION%.insertOne({id: %REP_ID%, role: '%REP_ROLE%', username: '%REP_USERNAME%', password: '%REP_PASSWORD_HASH%'});"

echo ✅ User inserted successfully into both databases.

:: === Run Python scripts ===
echo 🐍 Running Python script to upload users...
python ./utils/upload_users.py

echo 📊 Running Python script to upload grades...
python ./utils/upload_grades.py

:: === FINISH ===
echo.
echo ✅ All services are up and running!
echo 🌐 Login Service API: http://localhost:3001
echo 📦 MongoDB (login-database): mongodb://localhost:3002/clearskydb
echo 📨 RabbitMQ UI: http://localhost:15672 (guest/guest)

endlocal
pause
