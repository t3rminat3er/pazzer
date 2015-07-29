App.SideDeckService = Ember.Service.extend({
    random: function () {
        var cards = [];
        for (var i = 0; i < 4; i++) {
            var value = Math.floor(Math.random() * 12);
            value = value - 6;
            cards.push(new App.Card(value));
        }
        console.log("random side deck", cards);
        return cards;
    }
});