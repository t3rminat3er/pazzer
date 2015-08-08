var ID = require('./id.js'),
    sideDeckService = require('./sideDeckService.js'),
    util = require('util'),
    Player = require('./player.js'),
    Deck = require('./deck.js'),

    Match = function (player1, name) {
        
        this.id = ID();
        this.name = name;
        
        player1.match = this;
        
        var match = this,
            player2 = {},
            deck = {},
            currentPlayer,

            assignHandDecks = function () {
                player1.handDeck = sideDeckService.getSideDeck(player1.user);
                player1.emit('handDeck', player1.handDeck);
                player1.emit('handDeck', new Array(player1.handDeck.length), player2.socket);
                
                player2.handDeck = sideDeckService.getSideDeck(player2.user);
                player2.emit('handDeck', player2.handDeck);
                player2.emit('handDeck', new Array(player2.handDeck.length), player1.socket);
            },

            attachListener = function (event, handler) {
                player1.on(event, handler);
                player2.on(event, handler);
            },

            playHandCard = function (args) {
                console.log('playHandCard', arguments, this);
                if (isActingSocketCurrentPlayer(this)) {
                    var player = getPlayerFromSocket(this);
                    var card = player.handDeck[args.index];
                    if (!card.value === args.card.value) {
                        this.emit('alert', "Your handdeck doesn't contain a card with the value " + card.value + ". Are you cheating?");
                        return;
                    }
                    player.handDeck.splice(args.index, 1);
                    player.emitPublic('playedCard', args);
                    player.onCardDrawn(card);
                    return;
                }
            },

            emit = function (event, content) {
                player1.socket.emit(event, content);
                player2.socket.emit(event, content);
            },

            swapPlayers = function () {
                // swap players
                
                console.log('swapping players. current: ', currentPlayer.user.id);
                currentPlayer = currentPlayer === player1 ?
                    player2 : player1;
                console.log('swapped players. current: ', currentPlayer.user.id);
            },

            isActingSocketCurrentPlayer = function (socket) {
                var currentIsActive = currentPlayer.user.id === getPlayerFromSocket(socket).user.id;
                console.log('current is active', currentIsActive);
                return currentIsActive;
            },

            getPlayerFromSocket = function (socket) {
                var user = socket.user;
                var player = player1.user.id === user.id ? player1 : player2;
                return player;
            },

            hold = function () {
                if (isActingSocketCurrentPlayer(this)) {
                    currentPlayer.setHolding();
                    nextTurn();
                }
            },

            checkWin = function () {
                console.log('match.js checkWin ', arguments);
            },
        
            nextTurn = function () {
                
                if (!currentPlayer) {
                    // first round
                    // TODO Properly determine who starts
                    currentPlayer = Math.random() < 0.5 ? player1 : player2;
                } else {
                    currentPlayer.setTurn(false);
                    if (currentPlayer.total > 20) {
                        emit('alert', currentPlayer.user.name + " LOSES! he drew more than 20 this round!");
                        return;
                    }
                    swapPlayers();
                    if (currentPlayer.isHolding) {
                        // current player is holding - swap back again
                        console.log('current player is holding');
                        swapPlayers();
                        if (currentPlayer.isHolding) {
                            console.log('both players is holding');
                            // both holding
                            checkWin();
                            return;
                        }
                    }
                }
                
                var card = deck.draw();
                console.log('match.js card drawn', card);
                currentPlayer.onCardDrawn(card);
                currentPlayer.setTurn(true);
                
                
                if (currentPlayer.total === 20) {
                    // auto hold this player and start new turn switching to the other player
                    console.log('autoHOlding');
                    currentPlayer.setHolding();
                    nextTurn();
                }
                
            },

            attachListeners = function () {
                attachListener('endTurn', function () {
                    var sendingPlayer = getPlayerFromSocket(this);
                    if (!sendingPlayer.turn) {
                        this.emit('alert', "Not your turn!");
                        return;
                    }
                    nextTurn();
                });
                attachListener('playHandCard', playHandCard);
                attachListener('hold', hold);
            };
        
        player1.socket.emit('match.joined', this);
        
        this.emitPublicPlayerAction = function (player, event, content) {
            console.log('match.js emitPUblicPlayerAction', event, content);
            player.emit(event, content, player1.socket);
            player.emit(event, content, player2.socket);
        };
        
        this.onPlayerJoined = function (opponent) {
            player2 = opponent;
            player2.match = this;
            
            console.log('match.js newPlayer', player2.user);
            player1.socket.emit('opponent.joined', player2.user);
            
            player2.socket.emit('match.joined', this);
            player2.socket.emit('opponent.joined', player1.user);
            
            deck = new Deck();
            nextTurn();
            
            assignHandDecks();
            attachListeners();
            //console.log('match.js', players);
            //console.log('match.js onPlayerJoined', arguments);
            // TODO get tabledeck
            // TODO decide on who starts
        };
    };

Player.prototype.on = function (event, handler) {
    this.socket.on(event, handler);
};

Player.prototype.emitPublic = function (event, content) {
    this.match.emitPublicPlayerAction(this, event, content);
};

Player.prototype.onCardDrawn = function (card) {
    this.total += card.value;
    
    this.emitPublic('drawn', {
        card: card,
        total: this.total
    });
};

Player.prototype.hasPlayedHandCardThisTurn = false;

Player.prototype.setTurn = function (isHisTurn) {
    if (isHisTurn) {
        this.hasPlayedHandCardThisTurn = false;
    }
    this.emitPublic('turn', isHisTurn);
    this.turn = isHisTurn;
};

Player.prototype.setHolding = function () {
    this.isHolding = true;
    this.emitPublic('holding', true);
}

Player.prototype.emit = function (event, content, socket) {
    if (!socket) {
        console.log("player emit socket using player socket");
        socket = this.socket;
    } else {
        console.log("player emit socket using provideds socket");
    }
    event = this.user.id + '.' + event;
    console.log('player.emit: ', event, content);
    socket.emit(event, content);
};

module.exports = Match;

