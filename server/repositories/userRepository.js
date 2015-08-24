
var db = require('./dataBase.js');

var get = function(credentials) {
    db.User.findOne(credentials, function(err, result) {
        if (result) {
            onUserLoggedIn({ name: result.username, id: result.id }, socket);
        } else {
            socket.emit('alert', 'Nutzername oder Passwort falsch.');
        }
        console.log("user.logged in", arguments);
    });
};

module.exports = {};
module.exports.get = get;