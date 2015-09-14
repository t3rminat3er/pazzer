var port = 34251;

var socketServer = require('./js/socketServer.js');

var register = require('./js/register.js');
var login = require('./js/login.js');
var players = require('./js/players.js');
var matches = require('./js/matches.js');
var sideDeck = require('./js/sideDeckService.js');

socketServer.listen(port);

