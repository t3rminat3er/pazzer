App.MatchController = Ember.ArrayController.extend({
    login: Ember.inject.controller('login'),
    sideDeck: Ember.inject.service('sideDeck'),
    tableDeckService: Ember.inject.service('tableDeck'),

    opponentUser: {},
    localPlayer: function () {
        return new this.Player(this.get('login.user'), this.get('tableDeck'), this.get('sideDeck').random());
    }.property('login.user', 'sideDeck', 'tableDeck'),
    opponentPlayer: function () {
        return new this.Player(this.get('opponentUser'), this.get('tableDeck'), this.get('sideDeck').random());
    }.property('opponentUser', 'sideDeck', 'tableDeck'),

    match: {},
    
    turn: 0,

    tableDeck: function () {
        return this.get('tableDeckService').createNew();
    }.property('tableDeckService'),

    currentPlayer: null,
    previousPlayer: null,

    init: function () {
        this._super();
        console.log(this.actions);

        var _this = this;
        Ember.run.later(this,function(){
            _this.send('nextTurn');
        }, 1000);
    },

    currentPlayerChanged: Ember.observer('currentPlayer', function () {
        if (this.previousPlayer) {
            this.set('previousPlayer.turn', false);
        }
        this.previousPlayer = this.currentPlayer;
        this.set('currentPlayer.turn', true);
    }),

    currentPlayerOpenCardsChanged: Ember.observer('currentPlayer.openCards', function() {
        
    }),

    actions: {
        nextTurn: function () {
            this.set('turn', this.turn + 1);
            if (!this.get('currentPlayer')) {
                // first turn
                console.log("first run");
                this.set('currentPlayer', this.get('localPlayer')); // set the local player first for now
            } else {
                if (this.currentPlayer.total > 20) {
                    alert(this.set('currentPlayer.user.name') + " LOSES! he drew more than 2 this round!");
                    return;
                }
                if (this.get('currentPlayer.isHolding')) {
                    // current player is holding
                } else {
                    // swap players
                    var currentPlayer = this.get('currentPlayer') === this.get('localPlayer') ?
                        this.get('opponentPlayer') : this.get('localPlayer');
                    this.set('currentPlayer', currentPlayer);
                }
            }
            this.get('currentPlayer').draw();
            if (this.currentPlayer.total === 20) {
                // auto hold this player and start new turn
                this.set('currentPlayer.isHolding', true);
                this.send('nextTurn');
            }
        },

        playHandCard: function (card) {
            if (card.player !== this.get('currentPlayer')) {
                console.warn("Not this player's turn");
                return;
            }
            this.currentPlayer.openCards.pushObject(card);
            this.currentPlayer.playHandCard(card);
            // only one hand can be played per round
            this.send('nextTurn');
        }
    },


    Player: function (user, tableDeck, handDeck) {
        for (var i = 0; i < handDeck.length; i++) {
            handDeck[i].player = this;
        }
        console.log("handdeck", handDeck);
        this.user = user;
        this.tableDeck = tableDeck;
        this.openCards = [];
        this.handDeck = handDeck;
        this.turn = false;

        this.total = 0;

        this.draw = function () {
            console.log('tabledeck', this.tableDeck);
            var card = this.tableDeck.getCard();
            console.log(card);
            Ember.set(this, 'total', this.total + card.value);
            this.openCards.pushObject(card);
        };
        this.playHandCard = function (card) {
            this.handDeck.removeObject(card);
            Ember.set(this, 'total', this.total + card.value);
        }
    }
});