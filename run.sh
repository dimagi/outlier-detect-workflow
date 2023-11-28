#!/bin/bash

if [ "$#" -ne 5 ]; then
    echo "run.sh <commcare hq> <commcare username> <commcare api key> <commcare auth mode> <commcare project>"
    exit 1
fi

CC_HQ=$1 CC_USER=$2 CC_APIKEY=$3 CC_AUTH_MODE=$4 CC_PROJECT=$5 docker-compose up --build