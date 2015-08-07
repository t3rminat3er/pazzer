App.Router.map(function () {
    this.route('login', { path: '/' });
    this.route('lobby', { path: '/lobby' });
    this.route('match', { path: '/match/:id' });
});


App.LobbyRoute = Ember.Route.extend({
    renderTemplate: function () {
        this.render('lobby');
        this.render('matches', {
            outlet: 'matches',
            controller: this.controllerFor('matches'),
            into: 'lobby'
        });
        this.render('players', {
            outlet: 'players',
            controller: this.controllerFor('players'),
            into: 'lobby'
        });
    }
});

App.MatchRoute = Ember.Route.extend({
    setupController: function (controller, model) {
    }
});