#!/bin/bash

# Check if exactly one argument is given (expecting .env file)
if [ "$#" -eq 1 ]; then
    # Source the .env file to set the environment variables
    source "$1"
elif [ "$#" -ne 0 ]; then
    # If arguments are provided but not exactly one, show an error message
    echo "Usage: run.sh [path_to_env_file]"
    exit 1
fi

# Proceed with the docker-compose command
docker-compose up --build