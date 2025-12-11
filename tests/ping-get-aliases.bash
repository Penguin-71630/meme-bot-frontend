#!/bin/bash

# Check if TOKEN is provided
if [ -z "$TOKEN" ]; then
  echo "Error: TOKEN environment variable is required"
  echo "Usage: TOKEN=your_token_here ./ping-get-aliases.bash"
  exit 1
fi

curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$TOKEN\"}" \
  -c cookies.txt \
  -v > test.log 2>&1

# Parse refresh_token from cookies.txt
REFRESH_TOKEN=$(grep refresh_token cookies.txt | awk '{print $7}')

curl -b "refresh_token=$REFRESH_TOKEN" http://localhost:8080/api/aliases -v >> test.log 2>&1

# Display the result
echo "Test completed. Check test.log for details."
