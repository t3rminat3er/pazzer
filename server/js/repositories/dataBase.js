﻿
var mongoose = require('mongoose');
var cards = require('./../cards.js');

var db = mongoose.connection;
var Schema = mongoose.Schema;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("mongo db connection successful");
});

mongoose.connect('mongodb://localhost/pazzaak');


var userSchema = new Schema({
    name: { type: String, index: { unique: true } },
    password: { type: String, required: true },
    sideDeck: {
        title: { type: String , default: "Sidedeck" },
        cards: []
    },
    isGuest: {type: Boolean}
});

userSchema.virtual('id').get(function () {
    return this._id;
}),

userSchema.set('toJSON', {
    virtuals: true
});

if (!userSchema.options.toJSON) {
    userSchema.options.toJSON = {};
}
userSchema.options.toJSON.hide = '_id password';

userSchema.options.toJSON.transform = function (doc, ret, options) {
    if (options.hide) {
        options.hide.split(' ').forEach(function (prop) {
            delete ret[prop];
        });
    }
}

var defaultAvailableCardValues = [
    -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6
];

userSchema.virtual('availableSideDeckCards').get(function () {
    return defaultAvailableCardValues.map(function (value) {
        return new cards.PlusMinusCard(value);
    });
});

db.User = mongoose.model("user", userSchema);
module.exports = db;
