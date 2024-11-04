#!/bin/bash

# Navigate to the directory of the script
cd "$(dirname "$0")" || exit

echo "Building and starting the password manager."

#debugging
# # Check if Dockerfile exists in expected locations
# if [ -f ./FrontEnd/Dockerfile ]; then
#   echo "Frontend Dockerfile found at ./FrontEnd/Dockerfile"
# else
#   echo "Frontend Dockerfile NOT found at ./FrontEnd/Dockerfile"
# fi

# echo "Current working directory: $(pwd)"

# Stop any existing containers and remove them
docker-compose down

# Build and start the containers
#for debugging
# docker-compose up --build > docker_build.log 2>&1
docker-compose up --build -d


# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Password manager is running successfully."
    echo "Access the database on port 5432."
    echo "Access the frontend on port 3000."
else
    echo "Failed to run the password manager."
    # for debugging
    # tail -n 20 docker_build.log
    exit 1
fi

# Might not be necessary
# # Create an executable package
# echo "Building the executable..."
# docker-compose exec app python setup.py build  # Adjust this command based on your packaging method

# if [ $? -eq 0 ]; then
#     echo "Executable built successfully."
# else
#     echo "Failed to build the executable."
#     exit 1
# fi