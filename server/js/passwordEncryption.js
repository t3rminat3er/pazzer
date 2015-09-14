
var bcrypt = require('bcryptjs');

var encrypt = function(password, callback) {
    bcrypt.genSalt(6, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            callback(hash, err);
        });
    });
};

var matches = function(password, hash, callback)
{
    bcrypt.compare(password, hash, function(error, res) {
        callback(res);
    });
}

module.exports = {};
module.exports.encrypt = encrypt;
module.exports.matches = matches;
