#!/bin/bash

# Navigate to the directory of the script
cd "$(dirname "$0")" || exit

echo "Building and starting the password manager."

# Stop any existing containers and remove them
docker-compose down

# Build and start the containers
docker-compose up --build

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Password manager is running successfully."
    echo "Access the database on port 5432."
    echo "Access the frontend on port 3000."
else
    echo "Failed to run the password manager."
    exit 1
fi