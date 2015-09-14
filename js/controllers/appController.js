App.AppController = Ember.Controller.extend({

    sockets: {
        'error.route': function (fallback) {
            this.transitionToRoute(fallback);
        }
    }
});