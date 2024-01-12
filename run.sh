#!/bin/bash

# Check if at least two arguments are given (config.yaml and outlier_data_export-DET.xlsx)
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 <path_to_config.yaml> <path_to_outlier_data_export-DET.xlsx> [path_to_env_file]"
    exit 1
fi

# Validate and set file paths
config_file="$1"
outlier_data_file="$2"
env_file="$3"

#copy files
cp "$config_file" outlierdetect/config.yaml
cp "$config_file" commcare_data_export/config.yaml
cp "$outlier_data_file" commcare_data_export/outlier_data_export-DET.xlsx

# If an .env file is provided, source it to set environment variables
if [ -n "$env_file" ]; then
    source "$env_file"
fi

# Proceed with the docker-compose command
docker-compose up --build

# Clean up by deleting the copied files
rm -f outlierdetect/config.yaml
rm -f commcare_data_export/config.yaml
rm -f commcare_data_export/outlier_data_export-DET.xlsx
