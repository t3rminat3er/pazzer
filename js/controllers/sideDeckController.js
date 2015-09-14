App.SideDeck = Ember.Object.extend({
    name: null,
    cards: [],

    init: function () {
        this._super();
        this.title = this.title ? this.title : null;
        this.cards = this.cards ? this.cards.splice() : [];
    }
});

App.SideDeckController = Ember.Controller.extend({
    availableCards: [],
    login: Ember.inject.controller('login'),
    selectedSideDeck: function () {
        var user = this.get('login').user;
        var val = user.sideDeck ? App.SideDeck.create(user.sideDeck) : App.SideDeck.create();
        return val;
    }.property('login'),
    
    actions: {
        add: function (card) {
            var cards = this.get('selectedSideDeck.cards');
            if (cards.length >= 10) {
                alert("Ein Side Deck darf maximal 10 Karten beinhalten.");
            } else {
                cards.pushObject(card);
                this.set('unsaved', true);
            }
        },
        remove: function (index) {
            this.get('selectedSideDeck.cards').removeAt(index);
            this.set('unsaved', true);
        },

        save: function () {
            var length = this.get('selectedSideDeck.cards').length;
            if (length !== 10) {
                alert("Ein Side Deck muss aus 10 Karten bestehen.");
                return;
            }
            this.socket.emit('sideDeck.set', this.get('selectedSideDeck'));
        }
    },

    sockets: {
        'sideDeck.availableCards': function (availableCards) {
            this.set('availableCards', availableCards);
        },

        'sideDeck.current': function (sideDeck) {
            this.set('login.user.sideDeck', sideDeck);
            this.set('unsaved', false);
            history.back();
        }
    }
});

