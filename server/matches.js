var Match = require('./match.js'),
    Player = require('./player.js'),
    socketServer = require('./socketServer.js'),
    util = require('util'),


    openMatches = [
        {
                id: "123id",
                name: "Server Test Match"
        }],
        
    getMatches = function () {
        console.log("getMatches", openMatches);
        this.emit('matches', openMatches);
    },

    createMatch = function (matchName) {
        var match = new Match(matchName);
        match.onPlayerJoined(new Player(this));
        openMatches.push(match);
        socketServer.io.emit('matchOpened', match);
    },

    joinMatch = function (matchId) {
        console.log('find by id', matchId);
        var match;
        for (var i = 0; i < openMatches.length; i++) {
            match = openMatches[i];
            if (match.id === matchId) {
                console.log('matches.js', 'match found');
                // remove - match is no longer open
                match.onPlayerJoined(new Player(this));
                
                // TODO uncomment - testing
                //socketServer.io.emit('matchClosed', match);
                openMatches.splice(i, 1);
                return;
            }
        }
        console.warn('no open match with id: ', matchId);
        this.emit('alert', util.format('Kein Spiel mit der angegebenen ID %s gefunden.', matchId));
        return;
    };


socketServer.io.on('connection', function (socket) {
    socket.on('getMatches', getMatches);
    socket.on('match.create', createMatch);
    socket.on('joinMatch', joinMatch);
});

module.exports = {};