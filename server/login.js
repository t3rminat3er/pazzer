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
    socket.user = user;
    onlinePlayers.push(user);
    if (socket && socket.emit) {
        socket.emit('loggedIn', user);
    }
    socketServer.io.emit('playerCameOnline', user);
},

    onUserLoggedOut = function (user) {
        if (!user) {
            return;
        }
        
        socketServer.io.emit('playerWentOffline', user);
        
        var index = onlinePlayers.indexOf(user);
        if (index > -1) {
            onlinePlayers.splice(index, 1);
            console.log("on user logged out", user);
        } else {
            console.warn("logged out user was not registered", user);
        }
    },

    onSocketDisconnect = function () {
        var user = this.user;
        if(!user){
            return;
        }
        
        onUserLoggedOut(this.user);
        
        // remote the guest if it was one - for unique user id and name
        for (var i = 0; i < guests.length; i++) {
            var guest = guests[i];
            if (guest) {
                if (guest.id === user.id) {
                    console.log("guest disconnected", guest.name);
                    guests[i] = null;
                    return;
                }
            }
        }
    },

    getGuestName = function (i) {
        return "Guest " + i;
    },

    onGuestLogin = function () {
        var guest = new db.User();
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
        userRepo.get(credentials, function (user, error) {
            if (error) {
                socket.emit('alert', 'Internal Server error.');
            }
            else if (user) {
                onUserLoggedIn({ name: user.name, id: user.id }, socket);
            } else {
                socket.emit('alert', 'Nutzername oder Passwort falsch.');
            }
        });
    },

    getOnlinePlayers = function () {
        return onlinePlayers.map(function (serverUser) {
            return serverUser;
        });
    };



module.exports = {};
module.exports.onUserLoggedIn = onUserLoggedIn;
module.exports.getOnlinePlayers = getOnlinePlayers;