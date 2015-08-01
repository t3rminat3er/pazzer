var port = 34251;

var socketServer = require('./socketServer.js');

var login = require('./login.js');
var players = require('./players.js');
var matches = require('./matches.js');

socketServer.listen(port);

