#!/bin/bash

docker compose down

git pull

docker image prune -a -f
docker builder prune -f

docker compose up -d --build

docker image prune -f
