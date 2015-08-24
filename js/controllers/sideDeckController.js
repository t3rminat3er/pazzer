App.SideDeck = Ember.Object.extend({
    title: null,
    cards: [],

    init: function () {
        this._super();
        this.title = null;
        this.cards = [];
    }
});

App.SideDeckController = Ember.Controller.extend({
    availableCards: [],
    selectedSideDeck: App.SideDeck.create(),

    actions: {
        add: function (card) {
            var cards = this.selectedSideDeck.cards;
            if (cards.length > 10) {
                alert("Ein Side Deck darf maximal 10 Karten beinhalten.");
            } else {
                cards.pushObject(card);
            }
        },
        remove: function (index) {
            console.log(arguments);
            this.selectedSideDeck.cards.removeAt(index);
        }
    },

    sockets: {
        'sideDeck.availableCards': function (availableCards) {
            this.set('availableCards', availableCards);
        },

        'sideDeck.current': 'selectedSideDeck'
    }
});

