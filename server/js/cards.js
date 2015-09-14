Card = function (value) {
    this.value = value;
    this.name = value;
};

PlusMinusCard = function (value) {
    this.value = value;
    this.name = (value > 0 ? "plus" : "minus") + "-" + Math.abs(value);
};

var exports = module.exports = {};
exports.Card = Card;
exports.PlusMinusCard = PlusMinusCard;
