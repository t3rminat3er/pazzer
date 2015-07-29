App.TableDeckService = Ember.Service.extend({
    createNew: function () {
        var deck = new this.Deck(App.Card);
        console.log("random tabl deck", deck);
        return deck;
    },

    Deck: function (cardConstructor) {
        this.cards = [];
        this.cardsDrawn = 0;

        for (var i = 1; i <= 10; i++) {
            var value = i;
            for (var j = 0; j < 4; j++) {
                this.cards.push(new cardConstructor(value));
            }
        }

        this.getCard = function () {
            // source https://gist.github.com/jonarnaldo/9202694
            if (this.cards.length === this.cardsDrawn) {
                return null;
            } //case: check if all cards drawn

            var random = Math.floor(Math.random() * (this.cards.length - this.cardsDrawn));
            var temp = this.cards[random];

            //swap chosen card with card last in array
            this.cards[random] = this.cards[this.cards.length - this.cardsDrawn - 1];
            this.cards[this.cards.length - this.cardsDrawn - 1] = temp;
            this.cardsDrawn++;

            return temp;
        }



    }

});

App.Card =  function (value) {
        this.value = value;
    }