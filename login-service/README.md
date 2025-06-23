# MICROSERVICE 03

## Login 

This microservice exposes an api endpoint that is used for logging in and out. The api endpoint runs on port 3001 and the database is on port 3002. The api endpoints are /api/login and /api/logout

To ensure token consistency between microservies we use redis, exposed on port 6379
