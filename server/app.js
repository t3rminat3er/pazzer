var port = 34251;

var socketServer = require('./socketServer.js');

var register = require('./register.js');
var login = require('./login.js');
var players = require('./players.js');
var matches = require('./matches.js');
var sideDeck = require('./sideDeckService.js');

socketServer.listen(port);

