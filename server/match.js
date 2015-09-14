var ID = require('./id.js'),
    util = require('util'),
    Player = require('./player.js'),
    Set = require('./set.js'),

    Match = function (name) {
        this.id = ID();
        this.name = name;
        
        var player1 = null,
            player2 = null,
            currentSet,
            self = this,

            attachSocketListener = function (event, handler) {
                player1.socket.on(event, handler);
                player2.socket.on(event, handler);
            },

            attachSocketListeners = function () {
                attachSocketListener('endTurn', function () {
                    var sendingPlayer = getPlayerFromSocket(this);
                    if (!sendingPlayer.turn) {
                        emit('alert', "Not your turn!");
                        return;
                    }
                    currentSet.nextTurn();
                });
                attachSocketListener('playHandCard', function (args) {
                    console.log('playHandCard', arguments, this);
                    if (isSocketCurrentPlayer(this)) {
                        currentSet.currentPlayer.playHandCard(args);
                    }
                });
                attachSocketListener('hold', function () {
                    if (isSocketCurrentPlayer(this)) {
                        currentSet.currentPlayer.setHolding();
                        currentSet.nextTurn();
                    }
                });

                attachSocketListener('giveUp', function() {
                    currentSet.playerGaveUp(this.user);
                });
            },
            
            emit = function (event, content) {
                player1.socket.emit(event, content);
                player2.socket.emit(event, content);
            },

            isSocketCurrentPlayer = function (socket) {
                var currentIsActive = currentSet.currentPlayer.user.id === getPlayerFromSocket(socket).user.id;
                console.log('current is active', currentIsActive);
                return currentIsActive;
            },

            getPlayerFromSocket = function (socket) {
                var user = socket.user;
                var player = player1.user.id === user.id ? player1 : player2;
                return player;
            },

            onSetEnded = function (setEndArgs) {
                var startingPlayer;
                if (setEndArgs.hasWinner) {
                    // the winning player starts
                    startingPlayer = player1.user.id === setEndArgs.winner.id ? player1 : player2;
                    
                    var winningPlayer = setEndArgs.getWinningPlayer();
                    winningPlayer.setsWon++;
                    if (winningPlayer.setsWon === 3) {
                        // player won match
                        setEndArgs.matchEndArgs = {
                            winner: setEndArgs.winner,
                            reason: setEndArgs.winner.name + " Won this match!"
                        };
                    }
                } else {
                    // on a tie the player who didn't start the last set starts
                    startingPlayer = player1.user.id === currentSet.startingPlayer.user.id ? player2 : player1;
                }
                
                var cb = function () {
                    emit('set.ended', setEndArgs);
                    if (!setEndArgs.matchEndArgs) {
                        startNewSet(startingPlayer);
                    } else {
                        var matchEndedCallback = function() {
                            emit('match.ended', setEndArgs.matchEndArgs);
                        };
                        setTimeout(matchEndedCallback, 500);
                    }
                };
                setTimeout(cb, 100);
            },
            
            startNewSet = function (startingPlayer) {
                if (currentSet) {
                    currentSet.dispose();
                    currentSet.removeListener('setEnded', onSetEnded);
                }
                currentSet = new Set(player1, player2);
                currentSet.on('setEnded', onSetEnded);
                
                currentSet.start(startingPlayer);
            };
        
        
        this.emitPublicPlayerAction = function (player, event, content) {
            console.log('match.js emitPUblicPlayerAction', event, content);
            player.emitEvent(event, content, player1.socket);
            player.emitEvent(event, content, player2.socket);
        };
        
        this.onPlayerJoined = function (player) {
            console.log(player.__proto__);
            // override the emit method to also emit to socket
            
            
            console.log('match.js newPlayer', player.user);
            
            player.match = this;
            player.socket.emit('match.joined', this);
            
            if (!player1) {
                player1 = player;
            } else if (!player2) {
                // opponent joined - tell everyone!
                player2 = player;
                player1.socket.emit('opponent.joined', player2.user);
                player2.socket.emit('opponent.joined', player1.user);
                
                // let's go
                var startingPlayer = Math.random() < 0.5 ? player1 : player2;
                startNewSet(startingPlayer);
                
                attachSocketListeners();
            } else {
                player.socket.emit('alert', "This match is full");
            }
        };
    };

Player.prototype.emitPublic = function (event, content) {
    this.match.emitPublicPlayerAction(this, event, content);
};

Player.prototype.onCardPlayed = function (card) {
    this.total += card.value;
    this.openCards.push(card);
    
    this.emitPublic('drawn', {
        card: card,
        total: this.total
    });
};

Player.prototype.hasPlayedHandCardThisTurn = false;

Player.prototype.playHandCard = function (args) {
    if (this.hasPlayedHandCardThisTurn) {
        this.socket.emit('alert', "You've already played a hand card this turn.");
        return;
    }
    var card = this.handDeck[args.index];
    if (!card.value === args.card.value) {
        this.socket.emit('alert', "Your handdeck doesn't contain a card with the value " + card.value + ". Are you cheating?");
        return;
    }
    this.hasPlayedHandCardThisTurn = true;
    this.handDeck.splice(args.index, 1);
    this.emitPublic('playedCard', args);
    this.onCardPlayed(card);
}

Player.prototype.setTurn = function (isHisTurn) {
    if (isHisTurn) {
        this.hasPlayedHandCardThisTurn = false;
    }
    if (this.set('turn', isHisTurn)) {
        this.emitPublic('turn', isHisTurn);
    }
};

Player.prototype.set = function (variableName, value) {
    var oldValue = this[variableName];
    this[variableName] = value;
    return oldValue !== value;
};

Player.prototype.setHolding = function (isHolding) {
    // if a parameter was passed in use it - else set it to true
    isHolding = isHolding === undefined ? true : isHolding;
    console.log("player.setHolding", isHolding);
    if (this.set('isHolding', isHolding)) {
        this.emitPublic('holding', this.isHolding);
    }
}

Player.prototype.reset = function () {
    this.setHolding(false);
    this.setTurn(false);
    this.total = 0;
    this.openCards = [];
    this.gaveUp = false;
}

module.exports = Match;

