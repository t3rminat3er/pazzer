var socketIO = require('./socketServer.js').io,
    db = require('./repositories/dataBase.js'),
    userRepo = require('./repositories/userRepository.js');

var getHandCards = function(player) {
        var cards = [];
        for (var i = 0; i < 4; i++) {
            var value = Math.floor(Math.random() * 13);
            value = value - 6;
            if (value === 0) {
                i--;
                continue;
            }
            cards.push(new PlusMinusCard(value));
        }
        console.log("random side deck", cards);
        return cards;
    },

    getAvailableSideDeckCards = function() {
        var user = this.user;
        if (!user) {
            this.emit('error.route', 'login');
            return;
        }
        var availableCards = user.sideDeck.availableCards;
        console.log('sideDeckService.js getAvailableSideDeckCards ', availableCards);
        this.emit('sideDeck.availableCards', availableCards);
    },

    createSideDeck = function(sideDeck) {
        var user = this.user;
        if (!user) {
            this.emit('error.route', 'login');
            return;
        }
        user.sideDecks.push(new db.SideDeck(sideDeck));
        user.save();
    },

    getSideDecks = function() {
        var user = this.user;
        if (!user) {
            this.emit('error.route', 'login');
            return;
        }
        this.emit('sideDeck.all', user.sideDecks);
    },

    setSideDeck = function (sideDeck) {
        var user = this.user;
        if (!user) {
            this.emit('error.route', 'login');
            return;
        }
        console.log('setSideDeck ', arguments, this);
        var socket = this;
    };

socketIO.on('connection', function (socket) {
    socket.on('sideDeck.getAvailableCards', getAvailableSideDeckCards);
    socket.on('sideDeck.set', setSideDeck);
    socket.on('sideDeck.getAll', getSideDecks);
    socket.on('sideDeck.create', createSideDeck);
});

module.exports = {};
module.exports.getHandCards = getHandCards;