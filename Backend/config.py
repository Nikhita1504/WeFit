# Example: Configuration for API resources
CHALLENGE_API_URL = "http://localhost:3000/api/challenges/get"
START_CHALLENGE_API_URL = "http://localhost:3000/ActiveChallenge/create/${localStorage.getItem('JwtToken')}"
ACTIVATE_CHALLENGE_API_URL = "http://localhost:3000/api/challenges/:id"
