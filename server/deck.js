var Deck = function () {
    var cards = [],
        cardsDrawn = 0;
    
    for (var i = 1; i <= 10; i++) {
        var value = i;
        for (var j = 0; j < 4; j++) {
            cards.push(new Card(value));
        }
    }
    
    this.draw = function () {
        // source https://gist.github.com/jonarnaldo/9202694
        if (cards.length === cardsDrawn) {
            return null;
        } //case: check if all cards drawn
        
        var random = Math.floor(Math.random() * (cards.length - cardsDrawn));
        var temp = cards[random];
        
        //swap chosen card with card last in array
        cards[random] = cards[cards.length - cardsDrawn - 1];
        cards[cards.length - cardsDrawn - 1] = temp;
        cardsDrawn++;
        
        return temp;
    }
        
};

Card = function (value) {
    this.value = value;
    this.name = value;
};

module.exports = Deck;
