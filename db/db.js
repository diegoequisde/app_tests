const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development'
    ? console.log
    : null
});

module.exports = db;
