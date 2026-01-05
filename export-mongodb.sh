#!/bin/bash

# Create a directory for the exported data
mkdir -p ./init-mongo

# Export collections from local MongoDB database
echo "Exporting data from local MongoDB..."
mongodump --host 127.0.0.1 --port 27017 --db cse --out ./init-mongo/dump

# Create a MongoDB import script
cat > ./init-mongo/import.sh <<EOF
#!/bin/bash
echo "Importing data into MongoDB container..."
mongorestore --host localhost --port 27017 /docker-entrypoint-initdb.d/dump
EOF

# Make import script executable
chmod +x ./init-mongo/import.sh

echo "MongoDB data exported successfully."
echo "When you start Docker containers, the data will be automatically imported."
