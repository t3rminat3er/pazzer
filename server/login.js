var guests = [];
var onlinePlayers = [];
var users;

var socketServer = require('./socketServer.js'),
    userRepo = require('./repositories/userRepository.js'),
    db = require('./repositories/dataBase.js'),
    ID = require('./id.js');


socketServer.io.on('connection', function (socket) {
    socket.on('disconnect', onSocketDisconnect);
    socket.on('guestLogin', onGuestLogin);
    socket.on('login', onUserLogin);
});

var onUserLoggedIn = function (user, socket) {
    var serverUser = {
        user: user,
        socket: socket
    };
    socket.user = user;
    onlinePlayers.push(serverUser);
    if (socket && socket.emit) {
        socket.emit('loggedIn', user);
    }
    socketServer.io.emit('playerCameOnline', user);
},

    onUserLoggedOut = function (serverUser) {
        if (!serverUser) {
            return;
        }
        console.log("on user logged out", serverUser.user);
        
        socketServer.io.emit('playerWentOffline', serverUser.user);
        
        var index = onlinePlayers.indexOf(serverUser);
        if (index > -1) {
            onlinePlayers.splice(index, 1);
        } else {
            console.warn("logged out user was not registered", serverUser.user);
        }
    },

    onSocketDisconnect = function () {
        for (var i = 0; i < guests.length; i++) {
            var guest = guests[i];
            if (guest) {
                if (guest.socket === this) {
                    console.log("guest disconnected", guest.name);
                    guests[i] = null;
                    return;
                }
            }
        }
        if (this.user) {
            onUserLoggedOut(this.user);
        }
    },

    getGuestName = function (i) {
        return "Guest " + i;
    },

    onGuestLogin = function () {
        var guest = new db.User({
            id: ID()
        });
        var i = 1;
        for (; i < guests.length; i++) {
            if (!guests[i]) {
                break;
            }
        }
        guest.name = getGuestName(i);
        onUserLoggedIn(guest, this);
        guests[i] = guest;
    },

    onUserLogin = function (credentials) {
        var socket = this;
        userRepo.get(credentials, function (user) {
            if (user) {
                onUserLoggedIn({ name: user.username, id: user.id }, socket);
            } else {
                socket.emit('alert', 'Nutzername oder Passwort falsch.');
            }
        });
    },

    getOnlinePlayers = function () {
        return onlinePlayers.map(function (serverUser) {
            return serverUser.user;
        });
    };



module.exports = {};
module.exports.getOnlinePlayers = getOnlinePlayers;