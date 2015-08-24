window.App = Ember.Application.create({
    Socket: EmberSockets.extend({
        host: 'localhost',
        port: 34251,
        controllers: ['login', 'matches', 'players', 'match', 'createMatch', 'sideDeck', 'app'],
        autoConnect: true,
        init: function() {
            this._super();
            this.self = this;
            this.socket.on('alert', function (msg) {
                alert(msg);
                console.log('application.js', msg);
            });
        }
    }),
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true
});

App.ApplicationRoute = Ember.Route.extend({
    actions: {
        openModal: function (modalName, model) {
            var controllerFor = this.controllerFor(modalName);
            console.log("OPEN MODAL", modalName, controllerFor, this);
            return this.render(modalName, {
                into: 'application',
                outlet: 'modal',
                controller: controllerFor
            });
        },

        closeModal: function () {
            return this.disconnectOutlet({
                outlet: 'modal',
                parentView: 'application'
            });
        }
    }
});