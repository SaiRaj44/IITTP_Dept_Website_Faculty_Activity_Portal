#!/bin/bash
echo "Importing data into MongoDB container..."
mongorestore --host localhost --port 27017 /docker-entrypoint-initdb.d/dump
