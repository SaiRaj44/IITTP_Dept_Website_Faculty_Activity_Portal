#!/bin/bash

DB_NAME="cse"
DATA_DIR="cse"

for file in "$DATA_DIR"/*.bson; do
  COLLECTION_NAME=$(basename "$file" .bson)
  echo "Importing collection $COLLECTION_NAME from $file..."
  mongorestore --db "$DB_NAME" --collection "$COLLECTION_NAME" "$file"
done

