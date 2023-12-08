#!/bin/bash

if [ "$#" -ne 7 ]; then
    echo "run.sh <commcare hq> <commcare username> <commcare api key> <commcare auth mode> <commcare project> <commcare password>"
    exit 1
fi

CC_HQ=$1 CC_USER=$2 CC_APIKEY=$3 CC_AUTH_MODE=$4 CC_PROJECT=$5 CC_PASSWORD=$6 CC_OWNERID=$7 docker-compose up --build