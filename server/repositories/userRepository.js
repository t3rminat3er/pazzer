
var db = require('./dataBase.js');
var passwordEncryption = require('./../passwordEncryption.js');

var get = function (credentials, callback) {
    db.User.findOne({ name: credentials.name }, function (err, result) {
        if (result) {
            passwordEncryption.matches(credentials.password, result.password, function (matches) {
                
                if (matches) {
                    callback(result, null);
                } else {
                    callback(null, null);
                }
            });
        } else {
            callback(null, err);
        }
    });
};

module.exports = {};
module.exports.get = get;
module.exports.db = db;