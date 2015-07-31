App.LobbyController = Ember.Controller.extend({
    login: Ember.inject.controller('login'),

    username: function() {
        return this.get('login').user.name;
    }.property('login'),

    onlinePlayers: [],

    hostedMatches: []
});