App.MatchesController = Ember.Controller.extend({
    init: function () {
        this._super();
        this.socket.emit('getMatches');
    },

    matches: [],
    sockets: {
        matches: 'matches',
        matchOpened: function (match) {
            this.matches.pushObject(match);
        },
        matchClosed: function (match) {
            this.matches.removeObject(match);
        }
    }

});