var socketIO = require('./socketServer.js').io,
    db = require('./repositories/dataBase.js'),
    Deck = require('./deck.js'),
    userRepo = require('./repositories/userRepository.js');

var getHandCards = function (player) {
    
    var sideDeckCards = player.get('sideDeck').cards;
    var cards = [];
    if (sideDeckCards && sideDeckCards.length > 0) {
        // use the side deck the user has specified
        var sideDeck = new Deck(sideDeckCards);
        for (var j = 0; j < 4; j++) {
            cards.push(new PlusMinusCard(sideDeck.draw().value));
        }
    } else {
        // generate a random one
        // alternative: ask the user to create a side deck
        for (var i = 0; i < 4; i++) {
            var value = Math.floor(Math.random() * 13);
            value = value - 6;
            if (value === 0) {
                i--;
                continue;
            }
            cards.push(new PlusMinusCard(value));
        }
    }
    return cards;
},

    getAvailableSideDeckCards = function () {
        var user = this.user;
        if (!user) {
            this.emit('error.route', 'login');
            return;
        }
        var availableCards = user.availableSideDeckCards;
        this.emit('sideDeck.availableCards', availableCards);
    },

    createSideDeck = function (sideDeck) {
        var user = this.user;
        if (!user) {
            this.emit('error.route', 'login');
            return;
        }
        user.sideDecks.push(new db.SideDeck(sideDeck));
        user.save();
    },

    getSideDecks = function () {
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
        user.set('sideDeck', sideDeck);
        if (!user.isGuest) {
            user.save();
        }
        console.log('setSideDeck ', arguments, this);
        this.emit('sideDeck.current', sideDeck);
    };

socketIO.on('connection', function (socket) {
    socket.on('sideDeck.getAvailableCards', getAvailableSideDeckCards);
    socket.on('sideDeck.set', setSideDeck);
    socket.on('sideDeck.getAll', getSideDecks);
    socket.on('sideDeck.create', createSideDeck);
});

module.exports = {};
module.exports.getHandCards = getHandCards;