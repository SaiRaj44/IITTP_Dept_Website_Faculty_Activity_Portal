# Docker Setup for DeptFlow

This document explains how to run the DeptFlow application using Docker containers.

## Prerequisites

- Docker and Docker Compose installed on your system
- MongoDB running locally with your existing data (for the initial migration)

## Getting Started

### 1. Export Existing MongoDB Data

Run the provided script to export your local MongoDB data:

```bash
./export-mongodb.sh
```

This will:
- Export your local MongoDB database (cse)
- Create initialization scripts that will run when the Docker MongoDB container starts

### 2. Build and Start the Docker Services

```bash
docker-compose up -d
```

This command builds the Next.js application image (named "deptflow") and starts all three services:
- Web server (Next.js) on port 3000
- MongoDB service on port 27017
- Backup service that runs on a weekly schedule

### 3. Verify the Setup

- Access the web application: http://localhost:3000
- Check running containers: `docker-compose ps`
- View logs: `docker-compose logs -f web`

## Container Details

### Web Container (Next.js)

- Image name: `deptflow`
- Environment variables are configured in docker-compose.yml
- MongoDB connection points to the MongoDB container instead of localhost

### MongoDB Container

- Uses official MongoDB 6.0 image
- Persists data using a Docker volume
- Initial data is imported from your local database

### Backup Container

- Runs a weekly cron job (every Sunday at midnight)
- Creates MongoDB backups in the `./backups` directory
- Archives backups to `./backup-archive` on your host machine

## Data Persistence

The following directories on your host machine store persistent data:

- `./backups`: Raw MongoDB backups
- `./backup-archive`: Compressed backup archives
- Docker volume `mongodb_data`: MongoDB data files

## Manual Backup

To manually trigger a backup:

```bash
docker exec deptflow-backup mongodump --host mongodb --out /backup/manual-$(date +"%Y-%m-%d-%H-%M-%S")
```

## Restore from Backup

```bash
# Extract backup archive if needed
tar -xzf ./backup-archive/mongodb-backup-YYYY-MM-DD.tar.gz -C /tmp

# Restore to Docker MongoDB
docker exec -i deptflow-mongodb mongorestore --host localhost --dir /tmp/backup/YYYY-MM-DD/cse
```
