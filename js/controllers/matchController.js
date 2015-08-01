App.MatchController = Ember.Controller.extend({
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
    currentPlayerPlayedHandCard: false,

    currentPlayerChanged: function () {
        this.currentPlayerPlayedHandCard = false;
        console.log('current player changed');
        if (this.previousPlayer) {
            this.set('previousPlayer.turn', false);
        }
        this.previousPlayer = this.currentPlayer;
        this.set('currentPlayer.turn', true);
    }.observes('currentPlayer'),

    currentPlayerOpenCardsChanged: function () {
        var openCardsCount = this.currentPlayer.openCards.length;
        if (openCardsCount === 9) {
            this.set('currentPlayer.isHolding', true);
            if (!this.checkWin()) {
                this.send('nextTurn');
            }
        }
        console.log("current player open cards changed");
    }.observes('currentPlayer.openCards.[]'),

    swapPlayers: function () {
        // swap players
        var currentPlayer = this.get('currentPlayer') === this.get('localPlayer') ?
            this.get('opponentPlayer') : this.get('localPlayer');
        this.set('currentPlayer', currentPlayer);
    },

    checkWin: function () {
        // TODO check win after one is holding
        // 9 cards and not over 20 -> WIN
        // both holding - higher one but <= 20 -> WIN

        // return a bool indicating whether someone one
    },


    actions: {
        nextTurn: function () {
            this.set('turn', this.turn + 1);
            if (!this.get('currentPlayer')) {
                // first turn
                console.log("first run");
                this.set('currentPlayer', this.get('localPlayer')); // set the local player first for now
            } else {
                if (this.currentPlayer.total > 20) {
                    alert(this.get('currentPlayer.user.name') + " LOSES! he drew more than 20 this round!");
                    return;
                }
                this.swapPlayers();
                if (this.get('currentPlayer.isHolding')) {
                    // current player is holding - swap back again
                    this.swapPlayers();
                    if (this.get('currentPlayer.isHolding')) {
                        // both holding
                        this.checkWin();
                    }
                }
            }
            this.get('currentPlayer').draw();
            if (this.get('currentPlayer').total === 20) {
                // auto hold this player and start new turn switching to the other player
                console.log('autoHOlding');
                this.set('currentPlayer.isHolding', true);
                this.send('nextTurn');
            }
        },

        hold: function () {
            if (this.checkWin()) {
                return;
            }
            this.set('currentPlayer.isHolding', true);
            this.send('nextTurn');
        },

        playHandCard: function (card) {
            if (this.currentPlayerPlayedHandCard) {
                alert("You can only play one Hand Card per Turn. End your turn or Hold.");
                return;
            }
            if (card.player !== this.get('currentPlayer')) {
                console.warn("Not this player's turn");
                return;
            }
            this.currentPlayer.openCards.pushObject(card);
            this.currentPlayer.playHandCard(card);
            this.currentPlayerPlayedHandCard = true;
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