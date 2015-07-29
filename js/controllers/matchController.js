App.MatchController = Ember.ArrayController.extend({
    login: Ember.inject.controller('login'),
    sideDeck: Ember.inject.service('sideDeck'),
    opponentUser: {},

    localPlayer: function () {
        return new this.Player(this.get('login.user'), this.tableDeck, this.get('sideDeck').random());
    }.property('login.user', 'sideDeck'),
    opponentPlayer: function () {
        return new this.Player(this.get('opponentUser'), this.tableDeck, this.get('sideDeck').random());
    }.property('opponentUser', 'sideDeck'),

    match: {},
    tableDeck: {},
    turn: 1,


    actions: {
        nextTurn: function () {
            if (this.currentPlayer) {

                this.set('currentPlayer.turn', false);
                if (this.currentPlayer.total > 20) {
                    alert(this.get('currentPlayer.user.name') + " LOSES! he drew more than 2 this round!");
                    return;
                }
            }
            this.currentPlayer = this.turn % 2 === 0 ? this.get('localPlayer') :
                this.get('opponentPlayer');
            this.set('currentPlayer.turn', true);
            console.log(this.currentPlayer);
            this.currentPlayer.draw();
            if (this.currentPlayer.total === 20) {
                alert(this.get('currentPlayer.user.name') + " WINS this round!");
            }
            this.set('turn', this.turn + 1);
        },

        playHandCard: function (card) {
            console.log("playhandcard", card);
            this.currentPlayer.openCards.pushObject(card);
            this.currentPlayer.playHandCard(card);
        }
    },

    init: function () {
        this._super();
        console.log(this.actions);
    },


    Player: function (user, tableDeck, handDeck) {
        for (var i = 0; i < handDeck.length; i++) {
            handDeck[i].player = this;
            console.log(handDeck[i]);
        }
        console.log("handdeck", handDeck);
        this.user = user;
        this.tableDeck = tableDeck;
        this.openCards = [];
        this.handDeck = handDeck;
        this.turn = false;

        this.total = 0;

        this.draw = function () {
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