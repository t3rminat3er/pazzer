﻿App.MatchesController = Ember.Controller.extend({
    init: function() {
        this._super();
        this.socket.emit('getMatches');
    },

    matches: [],

    actions: {
        join: function(match) {
            console.log('join match');
            this.socket.emit('joinMatch', match.id);
        }
    },

    sockets: {
        matches: function (matches) {
            console.log('matches', arguments);
            this.set('matches', matches);
        },
        matchOpened: function (match) {
            console.log('matchesController.js matchOpened', arguments);
            this.matches.pushObject(match);
        },
        matchClosed: function (match) {
            this.matches.removeObject(this.matches.findBy('id', match.id));
        },
        'match.joined': function(match) {
            this.transitionTo('match', match.id);
        }
    }

});