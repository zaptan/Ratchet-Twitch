var winston = require('winston');
var tmi = require("tmi.js");
var sqlite3 = require('sqlite3').verbose();

var fs, settingsFile;

settingsFile = 'settings.json';
fs = require('fs');

var settings = JSON.parse(
    fs.readFileSync(settingsFile)
);
var bits = new (winston.Logger)({
transports: [
  new (winston.transports.File)({ filename: 'bits.log' })
]
});
var subs = new (winston.Logger)({
transports: [
  new (winston.transports.File)({ filename: 'subs.log' })
]
});
var chat = new (winston.Logger)({
transports: [
  new (winston.transports.File)({ filename: 'chat.log' })
]
});

var db = new sqlite3.Database(settings.database);

var options = {
    options: {
        debug: settings.debug
    },
    connection: {
        reconnect: settings.reconnect
    },
    identity: {
        username: settings.username,
        password: settings.token

    },
    channels: settings.channels
};


var client = tmi.client(options);

client.on("cheer", function (channel, userstate, message) {
    query = "INSERT INTO events (channel, user, timestamp, subscriber, turbo, type, count, badges, emotes, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"

    bits.log('info', query);

    db.run(query, [channel, userstate["username"], Date.now(), userstate["subscriber"], userstate["turbo"], 2, userstate["bits"], JSON.stringify(userstate["badges"]),  JSON.stringify(userstate["emotes"]), message ]);
});


client.on("chat", function (channel, userstate, message, self) {
    query = "INSERT INTO events (channel, user, timestamp, subscriber, turbo, type, badges, emotes, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";

    chat.log('info', query);
        db.run(query, [channel, userstate["username"], Date.now(), userstate["subscriber"], userstate["turbo"], 0, JSON.stringify(userstate["badges"]),  JSON.stringify(userstate["emotes"]), message ]);
    if (self) return;
});

client.on("resub", function (channel, username, months, message) {
    query = "INSERT INTO events (channel, user, timestamp, subscriber, type, count, message) VALUES (?, ?, ?, ?, ?, ?, ?);";

    subs.log('info', query);
        db.run(query, [channel, username, Date.now(), 'True', 1, months, message ]);
});

client.on("subscription", function (channel, username) {
    query = "INSERT INTO events (channel, user, timestamp, subscriber, type, count) VALUES (?, ?, ?, ?, ?, ?);";

    subs.log('info', query);
        db.run(query, [channel, username, Date.now(), 'True', 1, 1 ]);
});

// Connect the client to the server..
client.connect();