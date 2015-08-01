
var listeners = [];

var login = require('./login.js'),
    socketServer = require('./socketServer.js');

socketServer.io.on('connection', function (socket) {
    socket.on('getPlayers', function () {
        var players = login.getOnlinePlayers();
        console.log("get players", players);
        this.emit('onlinePlayers', players);
    });
});

module.exports = {};