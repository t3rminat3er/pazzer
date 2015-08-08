﻿var ID = require('./id.js'),
    sideDeckService = require('./sideDeckService.js'),
    util = require('util'),
    Player = require('./player.js'),
    Deck = require('./deck.js'),

    Match = function (player1, name) {
        this.id = ID();
        this.name = name;
        var match = this,
            player2 = {},
            deck = {},
            currentPlayer,

        assignHandDecks = function() {
                player1.handDeck = sideDeckService.getSideDeck(player1.user);
                player1.emit('handDeck', player1.handDeck);
                player1.emit('handDeck', new Array(player1.handDeck.length), player2.socket);

                player2.handDeck = sideDeckService.getSideDeck(player2.user);
                player2.emit('handDeck', player2.handDeck);
                player2.emit('handDeck', new Array(player2.handDeck.length), player1.socket);
            },

            attachListeners = function() {

            },
        
            emitPublicPlayerAction = function (player, event, content) {
                player.emit(event, content, player1.socket);
                player.emit(event, content, player2.socket);
            };
        
        player1.socket.emit('match.joined', this);
        
        this.onPlayerJoined = function (opponent) {
            player2 = opponent;
            
            console.log('match.js newPlayer', player2.user);
            player1.socket.emit('opponent.joined', player2.user);
            
            player2.socket.emit('match.joined', this);
            player2.socket.emit('opponent.joined', player1.user);
            
            // TODO Properly determine who starts
            currentPlayer = Math.random() < 0.5 ? player1 : player2;

            deck = new Deck();
            var card = deck.draw();

            emitPublicPlayerAction(currentPlayer, 'drawn', card);
            
            assignHandDecks();
            attachListeners();
            //console.log('match.js', players);
            //console.log('match.js onPlayerJoined', arguments);
            // TODO get tabledeck
            // TODO decide on who starts
        };
    };

Player.prototype.on = function(event, handler) {
    this.socket.on(event, handler);
};

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

