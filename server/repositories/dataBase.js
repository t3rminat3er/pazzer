
var mongoose = require('mongoose');
var cards = require('./../cards.js');

var db = mongoose.connection;
var Schema = mongoose.Schema;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("mongo db connection successful");
});

mongoose.connect('mongodb://localhost/pazzaak');

var SideDeckSchema = new Schema({
    name: String,
    cards: []
});

var userSchema = new Schema({
    name: { type: String, index: { unique: true } },
    password: { type: String, required: true },
    sideDecks: [SideDeckSchema],
    currentSideDeckId: String
});

var defaultAvailableCardValues = [
    -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6
];

userSchema.virtual('sideDeck.availableCards').get(function() {
    return defaultAvailableCardValues.map(function(value) {
        return new cards.PlusMinusCard(value);
    });
});

db.SideDeck = mongoose.model('sideDeck', SideDeckSchema);
db.User = mongoose.model("user", userSchema);
module.exports = db;
