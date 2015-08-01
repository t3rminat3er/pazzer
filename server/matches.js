var socketServer = require('./socketServer.js'),
    id = require('./id.js'),
    find = require('array-find'),

    openMatches = [];


socketServer.io.on('connection', function (socket) {
    socket.on('getMatches', function () {
        console.log("get players", matches);
        this.emit('matches', matches.map(function (match) {
            return match.meta;
        }));
    });

    socket.on('createMatch', function (matchName) {
        var matchMeta = {
            id: id(),
            name: matchName
        }
        var match = {
            meta: matchMeta,
            players: [
                {
                    user: this.user,
                    socket: this
                }]
        }
        openMatches.push(match);
        this.emit('matchCreated', matchMeta);
        socketServer.io.emit('matchOpened', matchMeta);
    });

    socket.on('joinMatch', function (matchId) {
        var match = openMatches.find(function(value) {
            return value.id === matchId;
        });
    });
});

module.exports = {};