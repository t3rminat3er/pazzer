﻿App.MatchController = Ember.Controller.extend({
    login: Ember.inject.controller('login'),

    opponent: {},
    player: {},
    match: {},

    log: function () {
        //var ctlr= this;
        //setTimeout(function() {
        //    console.log("player opencards", ctlr.get('player.openCards')[0]);
        //    console.log("opponent opencards", ctlr.get('opponent.openCards')[0]);
        //    ctlr.log();
        //}, 5000);
    },

    actions: {
        playHandCard: function (card) {
            if (!this.player.turn) {
                alert("Du bist nicht an der Reihe!");
                return;
            }
            var args = {
                index: this.player.handDeck.indexOf(card),
                card: card
            };
            console.log('matchController.js playHandCard', args, this);
            this.player.socket.emit('playHandCard', args);
        },

        nextTurn: function () {
            console.log('matchController.js nextTurn', arguments, this);
            if (!this.player.turn) {
                alert("Du bist nicht an der Reihe!");
                return;
            }
            this.player.socket.emit('endTurn');
        },

        hold: function () {
            if (!this.player.turn) {
                alert("Du bist nicht an der Reihe!");
                return;
            }
            console.log('matchController.js hold', arguments, this);
            this.player.socket.emit('hold');
        }
    },

    sockets: {
        'match.joined': function (match) {
            console.log('matchController.js matchCreated', this);
            this.match = match;
            this.set('player', App.Player.create({
                user: this.get('login.user'),
                socket: this.socket.socket
            }));
        },

        'opponent.joined': function (user) {
            console.log('matchController.js opponent joined', arguments);
            this.set('opponent', App.Player.create({
                user: user,
                socket: this.socket.socket
            }));
            this.log();
        }
    }
});

App.Player = Ember.Object.extend({
    user: {},
    socket: {},
    handDeck: [],
    openCards: null,
    total: 0,
    isHolding: false,
    turn: false,

    drawn: function (drawnResult) {
        console.log('drawn', this, this.user.id, drawnResult);
        this.get('openCards').pushObject(drawnResult.card);
        this.set('total', drawnResult.total);
    },

    playedCard: function (args) {
        var localCard = this.handDeck[args.index];
        console.log('played card', localCard);
        if (localCard) {
            if (!args.card.value === localCard.value) {
                return;
            }
            this.handDeck.removeObject(localCard);
        } else {
            // opponent player - cards have no value
            var newHandDeck = [];
            this.get('handDeck').removeAt(args.index);
            //newHandDeck.length = this.handDeck.length - 1;
            //this.set('handDeck', newHandDeck);
        }
    },

    init: function () {
        console.log('player init', this);
        this.set('openCards', []);
        this.set('handDeck', []);

        this.on('holding', 'isHolding');
        this.on('handDeck', 'handDeck');
        this.on('drawn', 'drawn');
        this.on('turn', 'turn');
        this.on('playedCard', 'playedCard');
    }
});

App.Player.reopen({
    on: function (event, handlerName) {
        var response = function (content) {
            var handler = Ember.get(this.player, this.handler);
            console.log('player response', arguments, this, handler);
            if (typeof (handler) === typeof (Function)) {
                handler.call(this.player, content);
            } else {
                Ember.set(this.player, this.handler, content);
            }
        };
        event = this.user.id + "." + event;
        console.log('player registering on', event, handlerName, this);
        this.socket.on(event, response.bind({ event: event, player: this, handler: handlerName }));
    }
});
