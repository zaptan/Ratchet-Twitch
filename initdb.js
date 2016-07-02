settingsFile = 'settings.json';
fs = require('fs');

var settings = JSON.parse(
    fs.readFileSync(settingsFile)
);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(settings.database);
db.run("CREATE TABLE events ('channel' TEXT NOT NULL,'user' TEXT not null,'timestamp' DATETIME not null,'subscriber' BOOLEAN,'turbo' BOOLEAN,'type' TEXT,'count' INT,'badges' TEXT,'emotes' TEXT,'message' TEXT )");
db.close();

/*
'id' INT PRIMARY KEY NOT NULL,
'channel' TEXT NOT NULL,
'user' TEXT not null,
'timestamp' DATETIME not null,
'subscriber' BOOLEAN,
'turbo' BOOLEAN,
'type' TEXT,
'count' INT,
'badges' TEXT,
'emotes' TEXT,
'message' TEXT 
*/
