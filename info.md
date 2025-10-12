command used to generate jwt secret : node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

user 1 :
{
"message": "User created successfully",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZWI1MmQzMWRlODQ0OWQxOGFhZTBmMCIsImVtYWlsIjoia2FydGlrQGV4YW1wbGUuY29tIiwiaWF0IjoxNzYwMjUyNjI3LCJleHAiOjE3NjAzMzkwMjd9.aSgI5HeCd0sDHzLEVb4u-ZcUVrvr-uv6rF7gx0a72sU",
"user": {
"id": "68eb52d31de8449d18aae0f0",
"email": "kartik@example.com"
}
}

login creds for post man :
{
"email": "kartik@example.com",
"password": "mypassword"
}
