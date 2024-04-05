#!/bin/bash

source .env

sed -i 's/${POSTGRES_USER}/'${POSTGRES_USER}'/' ./provisioning/datasources/datasources.yml
sed -i 's/${POSTGRES_PASSWORD}/'${POSTGRES_PASSWORD}'/' ./provisioning/datasources/datasources.yml
sed -i 's/${POSTGRES_DB}/'${POSTGRES_DB}'/' ./provisioning/datasources/datasources.yml
sed -i 's/${POSTGRES_HOST}/'${POSTGRES_HOST}'/' ./provisioning/datasources/datasources.yml
    
exec /run.sh