var PlusMinusCard = function (value) {
    this.value = value;
    this.name = (value > 0 ? "plus" : "minus") + "-" + Math.abs(value);
}, 
    
    getSideDeck = function (player) {
        var cards = [];
        for (var i = 0; i < 4; i++) {
            var value = Math.floor(Math.random() * 13);
            value = value - 6;
            if (value === 0) {
                i--;
                continue;
            }
            cards.push(new PlusMinusCard(value));
        }
        console.log("random side deck", cards);
        return cards;
    }


module.exports = {};
module.exports.getSideDeck = getSideDeck;