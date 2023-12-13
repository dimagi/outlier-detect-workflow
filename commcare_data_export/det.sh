#!/bin/sh
commcare-export --commcare-hq ${CC_HQ} --project ${CC_PROJECT} \
    --username ${CC_USER} --password ${CC_APIKEY} --auth-mode ${CC_AUTH_MODE} \
    --output-format sql --output postgresql://postgres:postgres@postgres/postgres \
    --query outlier_data_export-DET.xlsx