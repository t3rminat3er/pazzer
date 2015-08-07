App.MatchController = Ember.Controller.extend({
    login: Ember.inject.controller('login'),

    opponent: {},
    player: {},
    match: {},

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
        }
    }
});

App.Player = Ember.Object.extend({
    user: {},
    socket: {},
    handDeck: [],
    
    on: function (event, handlerName) {
        var response = function (content) {
            console.log('player response', arguments, this);
            var handler = Ember.get(this.player, this.handler);
            if (typeof (handler) === typeof (Function)) {
                handler(content);
            } else {
                Ember.set(this.player, this.handler, content);
            }
        };
        event = this.user.id + "." + event;
        console.log('player registering on', event, handlerName);
        this.socket.on(event, response.bind({ event: event, player: this, handler: handlerName }));
    },

    init: function () {
        console.log('player init', this);
        this.on('handDeck', 'handDeck');
    }
});
