App.MatchController = Ember.Controller.extend({
    login: Ember.inject.controller('login'),

    opponent: {},
    player: {},
    match: {},

    log: function() {
        //var ctlr= this;
        //setTimeout(function() {
        //    console.log("player opencards", ctlr.get('player.openCards')[0]);
        //    console.log("opponent opencards", ctlr.get('opponent.openCards')[0]);
        //    ctlr.log();
        //}, 5000);
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

    drawn: function (card) {
        console.log('drawn', this, this.user.id, card);
        this.get('openCards').pushObject(card);
        this.set('total', this.total + card.value);
    },

    init: function () {
        console.log('player init', this);
        this.on('handDeck', 'handDeck');
        this.on('drawn', 'drawn');
        this.set('openCards', []);
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
