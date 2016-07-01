#Run once
#a second time will clear your database
settingsFile = 'settings.json';
fs = require('fs');

var settings = JSON.parse(
    fs.readFileSync(settingsFile)
);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(settings.database);
db.run("CREATE TABLE events ('id' INT PRIMARY KEY NOT NULL,'channel' TEXT NOT NULL,'user' text not null,'timestamp' DATETIME not null,'subscriber' BOOLEAN,'folower' BOOLEAN,'type' text'count' int,'message' text )");
db.close();