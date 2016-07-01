var winston = require('winston');
var tmi = require("tmi.js");

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

var options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: settings.username,
        password: settings.token

    },
    channels: settings.channels
};

function rsubloop(times) {
    var strOut = "";
    for (i = 0; i < times; i++) {
        strOut += "dasH ";
    }
    return strOut;
}

var client = tmi.client(options);

client.on("cheer", function (channel, userstate, message) {
    bits.log('info', message, {'channel': channel, 'user': userstate});
    // userstate.bits
});


client.on("chat", function (channel, userstate, message, self) {
    chat.log('info', message, { 'channel': channel, 'user': userstate["display-name"]});
    if (self) return;
});

client.on("resub", function (channel, username, months, message) {
    subs.log('info', username + " resubbed for " + months + " months yay!", {'channel': channel, 'user': username});
});

client.on("subscription", function (channel, username) {
    subs.log('info', username + " is a new sub yay!", {'channel': channel, 'user': username});
});



// Connect the client to the server..
client.connect();