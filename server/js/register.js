var socketServer = require('./socketServer.js'),
    userRepo = require('./repositories/userRepository.js'),
    login = require('./login.js'),
    passwordEncryption = require('./passwordEncryption.js'),
    db = require('./repositories/dataBase.js');

socketServer.io.on('connection', function (socket) {
    socket.on('register', onRegister);
});

var onRegister = function (user) {
    var socket = this;
    db.User.findOne({ name: user.name }, function(error, res) {
        if (res) {
            socket.emit('alert', "Nutzername bereits vergeben.");
        } else {
            passwordEncryption.encrypt(user.password, function(hash, error) {
                if (error) {
                    socket.emit('alert', 'Internal error. try again.');
                } else {
                    user.password = hash;
                    db.User.create(user, function(error, res) {
                        if (error) {
                            socket.emit('alert', error.reason);
                        } else {
                            login.onUserLoggedIn(res, socket);
                        }
                    });
                }
            });
        }
    });
}