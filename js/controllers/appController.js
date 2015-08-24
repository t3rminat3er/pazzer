App.AppController = Ember.Controller.extend({

    sockets: {
        'error.route': function (fallback) {
            console.log('AppController.js error.route ', arguments, this, self);
            this.transitionToRoute(fallback);
        }
    }
});