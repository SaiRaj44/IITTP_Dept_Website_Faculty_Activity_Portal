#!/bin/bash

# This script runs inside the backup container to create MongoDB backups

# Set timestamp for backup naming
TIMESTAMP=$(date +"%Y-%m-%d")
BACKUP_DIR="/backup/$TIMESTAMP"
ARCHIVE_DIR="/backup-archive"

echo "Starting MongoDB backup at $(date)"

# Create backup using mongodump
mongodump --host mongodb --out $BACKUP_DIR

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "MongoDB backup completed successfully"
    
    # Create compressed archive
    tar -czf "$ARCHIVE_DIR/mongodb-backup-$TIMESTAMP.tar.gz" $BACKUP_DIR
    
    # Check if compression was successful
    if [ $? -eq 0 ]; then
        echo "Backup archive created: mongodb-backup-$TIMESTAMP.tar.gz"
        
        # Remove backups older than 4 weeks (28 days) from the archive directory
        find $ARCHIVE_DIR -name "mongodb-backup-*.tar.gz" -type f -mtime +28 -delete
        echo "Cleaned up old backup archives (older than 4 weeks)"
    else
        echo "Failed to create backup archive"
    fi
else
    echo "MongoDB backup failed"
    exit 1
fi

echo "Backup process completed at $(date)"
