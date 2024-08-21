#!/bin/sh
set -x
. ./.env

# Load the required values from config.yaml
activity_outlier_startdate=$(python -c "import yaml; print(yaml.safe_load(open('config.yaml'))['activity_outlier_startdate'])")
activity_outlier_enddate=$(python -c "import yaml; print(yaml.safe_load(open('config.yaml'))['activity_outlier_enddate'])")


commcare-export --commcare-hq "${CC_HQ}" --project "${CC_PROJECT}" \
    --username "${CC_USER}" --password "${CC_PASSWORD}" --auth-mode "${CC_AUTH_MODE}" \
    --output-format sql --output postgresql://postgres:postgres@postgres/postgres \
    --query outlier_data_export-DET.xlsx \
    --since "${activity_outlier_startdate}" \
    --until "${activity_outlier_enddate}"