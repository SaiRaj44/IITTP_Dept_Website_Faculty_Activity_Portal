// This script will run automatically when MongoDB container starts for the first time
// It ensures the database and collections are properly initialized

print('Starting MongoDB initialization...');

// Make sure we're using the right database
db = db.getSiblingDB('cse');

// Create any necessary indexes or users here
// For example, if you need text search capabilities on a collection:
// db.articles.createIndex({ "content": "text" });

print('MongoDB initialization completed.');
