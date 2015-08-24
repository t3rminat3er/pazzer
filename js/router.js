App.Router.map(function () {
    this.route('login', { path: '/' });
    this.route('lobby', { path: '/lobby' });
    this.route('match', { path: '/match/:id', function() {
        this.route('message');
    }
    });
    this.route('sideDeck', { path: '/sideDeck' });
});

App.MatchMessageRoute = Ember.Route.extend({
    controllerName: 'match'
});

App.SideDeckRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        console.log("sidedeckroute", controller);
        controller.socket.emit('sideDeck.getAvailableCards');
    }
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