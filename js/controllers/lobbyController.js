App.LobbyController = Ember.Controller.extend({
    login: Ember.inject.controller('login'),

    username: function () {
        console.log("getting user name")
        return this.get('login').user.name;
    }.property('login'),

    actions: {
        createMatch: function() {
            console.log('create match');
        }
    }
});