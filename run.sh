#!/bin/bash

# Check if at least two arguments are given (config.yaml and outlier_data_export-DET.xlsx)
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 <path_to_config.yaml> <path_to_outlier_data_export-DET.xlsx> [path_to_env_file]"
    exit 1
fi

# Get the directory of the current script
script_dir=$(dirname "$0")

# Validate and set file paths
config_file="$1"
outlier_data_file="$2"
env_file="$3"

# Copy files
cp "$config_file" "$script_dir/commcare_data_export_outlierdetect/config.yaml"
cp "$outlier_data_file" "$script_dir/commcare_data_export_outlierdetect/outlier_data_export-DET.xlsx"

# If an .env file is provided, source it to set environment variables
if [ -n "$env_file" ]; then
    source "$env_file"
fi

# Proceed with the docker-compose command
(cd "$script_dir" && docker-compose up --build --abort-on-container-exit)
(cd "$script_dir" && docker-compose down --volumes)

# Clean up by deleting the copied files
rm -f "$script_dir/commcare_data_export_outlierdetect/config.yaml"
rm -f "$script_dir/commcare_data_export_outlierdetect/outlier_data_export-DET.xlsx"
