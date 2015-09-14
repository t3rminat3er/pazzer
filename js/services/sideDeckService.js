App.SideDeckService = Ember.Service.extend({
    random: function () {
        var cards = [];
        for (var i = 0; i < 4; i++) {
            var value = Math.floor(Math.random() * 13);
            value = value - 6;
            if (value === 0) {
                i--;
                continue;
            }
            cards.push(new App.PlusMinusCard(value));
        }
        return cards;
    }
});