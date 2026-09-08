# 1. login
$body = @{ email = "john.doe@example.com"; password = "password123" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body $body

# 2. use access token
$headers = @{ Authorization = "Bearer $($response.data.accessToken)" }
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/current-user" -Headers $headers

# 3. refresh token
$refreshBody = @{ refreshToken = $response.data.refreshToken } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/refresh-token" -Method Post -ContentType "application/json" -Body $refreshBody



# register
$registerBody = @{ name = "John Doe"; email = "john.doe@example.com"; password = "password123" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -ContentType "application/json" -Body $registerBody

# login
$loginBody = @{ email = "john.doe@example.com"; password = "password123" } | ConvertTo-Json
$login = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body $loginBody

$access = $login.data.accessToken
$refresh = $login.data.refreshToken

# current user
$headers = @{ Authorization = "Bearer $access" }
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/current-user" -Headers $headers

# refresh token
$refreshBody = @{ refreshToken = $refresh } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/refresh-token" -Method Post -ContentType "application/json" -Body $refreshBody

# logout
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/logout" -Method Post -Headers $headers