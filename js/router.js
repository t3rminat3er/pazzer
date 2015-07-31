App.Router.map(function () {
    this.route('login', { path: '/' });
    this.route('lobby', { path: '/lobby' });
    this.route('match', { path: '/match/:id' });
});

App.LobbyRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        controller.set('hostedMatches', this.store.findAll('match'));
        controller.set('onlinePlayers', this.store.findAll('user'));
    }
});

App.MatchRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        controller.set('match', this.store.findRecord('match', model.id));
        controller.set('opponentUser', this.store.findRecord('user', 1));
    }
});