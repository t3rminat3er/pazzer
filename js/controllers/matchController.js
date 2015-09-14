App.MatchController = Ember.Controller.extend({
    login: Ember.inject.controller('login'),

    opponent: {},
    player: {},
    match: {},
    message: "",
    lastSetArgs: {},
    matchEndArgs: {},

    setPlayer: function (playerName, user) {
        this.set(playerName, App.Player.create({
            user: user,
            socket: this.socket.socket
        }));
    },

    resetPlayer: function (player) {
        player.get('openCards').clear();
        player.set('total', 0);
    },

    showMessage: function (message) {
        this.send('openModal', 'match.message');
        this.set('message', message);
    },

    showSetEnded: function (setEndedArgs) {
        this.set('lastSetArgs', setEndedArgs);
        this.send('openModal', 'match.setEnded');
    },

    onClosed: function () {
        console.log('matchController onClosed');
        this.socket.emit('match.player.left');
    },

    actions: {
        closeModal: function () {
            if (this.lastSetArgs) {
                // set end modal is open
                if (!this.get('lastSetArgs.matchEndArgs')) {
                    return true;
                }
                var oponentWating = this.matchEndArgs ? this.matchEndArgs.opponentWantsRematch : false;
                this.set('matchEndArgs', this.lastSetArgs.matchEndArgs);
                this.set('matchEndArgs.opponentWantsRematch', oponentWating);
                this.set('lastSetArgs', null);
                var self = this;
                setTimeout(function () {
                    self.send('openModal', 'match.matchEnded');
                }, 100);
                return true;
            }
            if (this.get('matchEndArgs')) {
                // match end modal open
                console.log("history back, modal close", this.matchEndArgs);
                this.set('matchEndArgs', undefined);
                history.back();
                return true;
            }
            return true;
        },

        rematch: function () {
            this.socket.emit('rematch');
            this.set('matchEndArgs.waiting', true);
        },

        playHandCard: function (card) {
            if (!this.player.turn) {
                alert("Du bist nicht an der Reihe!");
                return;
            }
            var args = {
                index: this.player.handDeck.indexOf(card),
                card: card
            };
            this.player.socket.emit('playHandCard', args);
        },

        nextTurn: function () {
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
            this.player.socket.emit('hold');
        },
        giveUp: function () {
            this.player.socket.emit('giveUp');
        }
    },

    sockets: {
        'match.joined': function (match) {
            this.match = match;
            this.setPlayer('player', this.get('login.user'));
        },

        'opponent.joined': function (user) {
            this.set('matchEndArgs', null);
            this.send('closeModal');
            this.setPlayer('opponent', user);
        },

        'opponent.wantsRematch': function (wantsRematch) {
            if (!wantsRematch) {
                this.send('closeModal');
            } else {
                if (!this.matchEndArgs) {
                    this.set('matchEndArgs', {});
                }
                this.set('matchEndArgs.opponentWantsRematch', wantsRematch);
            }
        },

        'set.ended': function (args) {
            if (args.hasWinner) {
                var winner = this.player.user.id === args.winner.id ? this.player : this.opponent;
                winner.get('setsWon').pushObject({});
            }
            if (args.set.player1.id === this.player.user.id) {
                args.set.player = args.set.player1;
                args.set.opponent = args.set.player2;
            } else {
                args.set.player = args.set.player2;
                args.set.opponent = args.set.player1;
            }

            this.resetPlayer(this.player);
            this.resetPlayer(this.opponent);
            this.showSetEnded(args);
        },
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
    setsWon: [],

    drawn: function (drawnResult) {
        this.get('openCards').pushObject(drawnResult.card);
        this.set('total', drawnResult.total);
    },

    playedCard: function (args) {
        var localCard = this.handDeck[args.index];
        if (localCard) {
            if (!args.card.value === localCard.value) {
                return;
            }
            this.handDeck.removeObject(localCard);
        } else {
            this.get('handDeck').removeAt(args.index);
        }
    },

    init: function () {
        this.set('openCards', []);
        this.set('handDeck', []);
        this.set('setsWon', []);

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
            if (typeof (handler) === typeof (Function)) {
                handler.call(this.player, content);
            } else {
                Ember.set(this.player, this.handler, content);
            }
        };
        event = this.user.id + "." + event;
        this.socket.on(event, response.bind({ event: event, player: this, handler: handlerName }));
    }
});
