const fs = require('fs');

function readDB(dbFile) {
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

function writeDB(dbFile, data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
