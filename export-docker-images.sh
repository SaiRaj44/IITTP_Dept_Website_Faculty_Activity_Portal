#!/bin/bash

# Script to export Docker images for client distribution
# This creates the client directory structure and exports the required images

echo "Creating client directory structure..."
mkdir -p client/images
mkdir -p client/scripts
mkdir -p client/config
mkdir -p client/volumes/mongodb_data
mkdir -p client/volumes/backups
mkdir -p client/volumes/backup-archive
mkdir -p client/init-mongo

# Copy necessary files
echo "Copying configuration files..."
cp docker-compose.yml client/config/
cp backup-mongodb.sh client/scripts/
cp -r init-mongo/* client/init-mongo/ 2>/dev/null || echo "No init-mongo files to copy"

# Create a client-specific docker-compose.yml
cat > client/docker-compose.yml << 'EOL'
version: '3.8'

services:
  # Next.js web application
  web:
    image: deptflow:latest
    container_name: deptflow-web
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/cse
      - NEXTAUTH_URL=https://cse.iittp.ac.in
      - NEXT_PUBLIC_API_URL=https://cse.iittp.ac.in
    depends_on:
      - mongodb
    networks:
      - deptflow-network

  # MongoDB service
  mongodb:
    image: mongo:6
    container_name: deptflow-mongodb
    restart: always
    ports:
      - "27018:27017"
    volumes:
      - ./volumes/mongodb_data:/data/db
      - ./init-mongo:/docker-entrypoint-initdb.d
    networks:
      - deptflow-network

  # Backup service (runs weekly)
  backup:
    image: mongo:6
    container_name: deptflow-backup
    restart: always
    volumes:
      - ./volumes/backups:/backup
      - ./volumes/backup-archive:/backup-archive
      - ./scripts/backup-mongodb.sh:/backup-script/backup-mongodb.sh
    command: >
      sh -c '
      echo "Setting up weekly backup cron job..."
      chmod +x /backup-script/backup-mongodb.sh
      echo "0 0 * * 0 /backup-script/backup-mongodb.sh" > /etc/crontabs/root
      crond -f -l 2
      '
    depends_on:
      - mongodb
    networks:
      - deptflow-network

networks:
  deptflow-network:
    driver: bridge
EOL

# Export Docker images
echo "Exporting deptflow:latest image (this may take a few minutes)..."
docker save deptflow:latest | gzip > client/images/deptflow-latest.tar.gz

echo "Exporting mongo:6 image (this may take a few minutes)..."
docker save mongo:6 | gzip > client/images/mongo-6.tar.gz

echo "Creating README.md with instructions..."
cat > client/README.md << 'EOL'
# Department Website Docker Setup

This package contains everything needed to run the Department Website application using Docker containers.

## Contents

- `images/`: Contains exported Docker images
  - `deptflow-latest.tar.gz`: The Next.js application image
  - `mongo-6.tar.gz`: The MongoDB database image
- `scripts/`: Contains utility scripts
  - `backup-mongodb.sh`: Script for weekly MongoDB backups
- `docker-compose.yml`: Configuration for running the containers
- `volumes/`: Directory structure for data persistence
  - `mongodb_data/`: MongoDB data storage
  - `backups/`: Temporary backup storage
  - `backup-archive/`: Long-term compressed backup storage
- `init-mongo/`: MongoDB initialization scripts (if any)

## Setup Instructions

### Step 1: Import Docker Images

```bash
# Import the Next.js application image
docker load < images/deptflow-latest.tar.gz

# Import the MongoDB image
docker load < images/mongo-6.tar.gz
```

### Step 2: Start the Services

```bash
# Start all services defined in docker-compose.yml
docker-compose up -d
```

This will start three containers:
- `deptflow-web`: The Next.js web application (accessible at http://localhost:3000)
- `deptflow-mongodb`: The MongoDB database (accessible at localhost:27018)
- `deptflow-backup`: A service that handles weekly MongoDB backups

### Step 3: Verify the Setup

```bash
# Check if all containers are running
docker-compose ps
```

## Volume Configuration

The setup uses the following volumes for data persistence:

- `./volumes/mongodb_data:/data/db`: MongoDB data storage
- `./volumes/backups:/backup`: Temporary backup storage
- `./volumes/backup-archive:/backup-archive`: Long-term compressed backup storage

## Backup System

The application includes an automated weekly backup system for MongoDB:

- **Schedule**: Every Sunday at midnight (0 0 * * 0)
- **Process**: 
  1. The backup service runs `backup-mongodb.sh` which uses `mongodump` to create a backup
  2. The backup is compressed and stored in `volumes/backup-archive/` with timestamp
  3. Backups older than 4 weeks are automatically deleted

### Backup Locations

- **Raw backups**: `volumes/backups/[YYYY-MM-DD]/`
- **Compressed archives**: `volumes/backup-archive/mongodb-backup-[YYYY-MM-DD].tar.gz`

### Manual Backup

You can trigger a manual backup by running:

```bash
docker exec deptflow-backup /backup-script/backup-mongodb.sh
```

## Troubleshooting

If you encounter any issues:

1. Check container logs: `docker-compose logs`
2. Ensure all services are running: `docker-compose ps`
3. Verify volume permissions are correct

## Stopping the Services

```bash
docker-compose down
```

To completely remove volumes and start fresh:

```bash
docker-compose down -v
```
EOL

echo "Export complete! Client package is ready in the 'client/' directory."
