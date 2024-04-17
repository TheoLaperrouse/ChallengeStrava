#!/bin/bash

source .env

sed -i 's/${POSTGRES_USER}/'${POSTGRES_USER}'/' ./provisioning/datasources/datasources.yml
sed -i 's/${POSTGRES_PASSWORD}/'${POSTGRES_PASSWORD}'/' ./provisioning/datasources/datasources.yml
sed -i 's/${POSTGRES_DB}/'${POSTGRES_DB}'/' ./provisioning/datasources/datasources.yml
sed -i 's/${POSTGRES_HOST}/'${POSTGRES_HOST}'/' ./provisioning/datasources/datasources.yml
sed -i 's/${STRAVA_CLIENT_ID}/'${STRAVA_CLIENT_ID}'/' ./config/grafana.ini
sed -i 's/${STRAVA_CLIENT_SECRET}/'${STRAVA_CLIENT_SECRET}'/' ./config/grafana.ini
    
exec /run.sh