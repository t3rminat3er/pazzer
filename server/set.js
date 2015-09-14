﻿var Deck = require('./deck.js'),
    sideDeckService = require('./sideDeckService.js'),
    events = require('events'),
    ID = require('./id.js'),

    SetEndArgs = function (hasWinner, winningPlayer, reason) {
        this.hasWinner = hasWinner;
        if (winningPlayer) {
            this.winner = winningPlayer.user;
        }
        this.reason = reason;
        
        this.getWinningPlayer = function () {
            return winningPlayer;
        };
    },

    Set = function (player1, player2) {
        var deck = {},
            self = this,
            isOver = false,
            id = ID(),

            assignHandDecks = function () {
                player1.handDeck = sideDeckService.getHandCards(player1.user);
                player1.emitEvent('handDeck', player1.handDeck);
                player1.emitEvent('handDeck', new Array(player1.handDeck.length), player2.socket);
                
                player2.handDeck = sideDeckService.getHandCards(player2.user);
                player2.emitEvent('handDeck', player2.handDeck);
                player2.emitEvent('handDeck', new Array(player2.handDeck.length), player1.socket);
            },

            checkFullTableWin = function (player) {
                if (player.openCards.length === 9) {
                    if (player.total <= 20) {
                        var reason = player.user.name + " filled his table and and managed to stay below a score of 20!";
                        return new SetEndArgs(true, player, reason);
                    }
                }
                return null;
            },

            checkWin = function () {
                var setEndArgs;
                var reason = "";
                if (self.currentPlayer.total > 20) {
                    // bust
                    console.log("player is bust", self.currentPlayer.user.name, self.currentPlayer.total);
                    reason = self.currentPlayer.user.name + " drew more than 20 this round!";
                    setEndArgs = new SetEndArgs(true, getNotCurrentPlayer(), reason);
                } else if (player1.isHolding && player2.isHolding) {
                    if (player1.total === player2.total) {
                        // a tie
                        reason = "You both have the same score. It's a TIE!";
                        setEndArgs = new SetEndArgs(false, null, reason);
                    } else {
                        // someone wins - let's find out who that might be!
                        var winner = player1.total > player2.total ? player1 : player2;
                        var loser = winner === player1 ? player2 : player1;
                        reason = winner.user.name + " has an higher score than " + loser.user.name;
                        setEndArgs = new SetEndArgs(true, winner, reason);
                    }
                } else {
                    setEndArgs = checkFullTableWin(player1);
                    if (!setEndArgs) {
                        setEndArgs = checkFullTableWin(player2);
                    }
                }
                
                console.log('set' + id + '.checkWin ', setEndArgs);
                if (setEndArgs) {
                    isOver = true;
                    setEndArgs.set = {
                        player1: player1,
                        player2: player2
                    }
                    self.emit('setEnded', setEndArgs);
                }
                return setEndArgs;
            },

            getNotCurrentPlayer = function () {
                var notCurrentPlayer = self.currentPlayer === player1 ?
                    player2 : player1;
                return notCurrentPlayer;
            },

            swapPlayers = function () {
                // swap players
                console.log('set ' + id + ' current player: ', self.currentPlayer.user.id);
                self.currentPlayer = getNotCurrentPlayer();
                console.log('set ' + id + ' current player: ', self.currentPlayer.user.id);
            },

            onCardPlayed = function () {
                var player = this;
                
                if (player.total === 20) {
                    // auto hold this player and start new turn switching to the other player
                    console.log('autoHOlding');
                    self.currentPlayer.setHolding();
                    self.nextTurn();
                }
            },

            drawForCurrentPlayer = function () {
                var card = deck.draw();
                console.log('match.js card drawn', card);
                self.currentPlayer.onCardPlayed(card);
                self.currentPlayer.setTurn(true);
            };
        
        this.currentPlayer = {};
        this.startingPlayer = {};
        
        this.start = function (startingPlayer) {
            self.startingPlayer = startingPlayer;
            
            player1.on('drawn', onCardPlayed);
            player2.on('drawn', onCardPlayed);
            
            player1.reset();
            player2.reset();
            
            this.currentPlayer = startingPlayer;
            deck = new Deck();
            assignHandDecks();
            drawForCurrentPlayer();
        };
        
        this.dispose = function () {
            isOver = true;
            player1.removeListener('drawn', onCardPlayed);
            player2.removeListener('drawn', onCardPlayed);
        };
        
        this.nextTurn = function () {
            if (isOver) {
                return;
            }
            
            this.currentPlayer.setTurn(false);
            if (checkWin()) {
                return;
            }
            swapPlayers();
            if (this.currentPlayer.isHolding) {
                // current player is holding - swap back again
                console.log('current player is holding');
                swapPlayers();
                if (this.currentPlayer.isHolding) {
                    console.log('both players are holding');
                    // both holding - set is definitely over
                    checkWin();
                    return;
                }
            }
            drawForCurrentPlayer();
        };
    };

Set.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = Set;