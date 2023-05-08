#!/bin/bash

export $(cat .env | xargs)
docker-compose down
git pull
docker-compose up --build -d
