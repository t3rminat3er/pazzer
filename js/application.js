window.App = Ember.Application.create({
    Socket: EmberSockets.extend({
        host: 'localhost',
        port: 34251,
        controllers: ['login', 'matches', 'players', 'match', 'createMatch'],
        autoConnect: true,
        init: function() {
            this._super();
            this.socket.on('alert', function (msg) {
                alert(msg);
                console.log('application.js', msg);
            });
        }
    }),
    LOG_TRANSITIONS: true, LOG_TRANSITIONS_INTERNAL: true
});

App.ApplicationRoute = Ember.Route.extend({
    actions: {
        openModal: function (modalName, model) {
            console.log("OPEN MODAL");
            this.controllerFor(modalName).set('model', model);
            return this.render(modalName, {
                into: 'application',
                outlet: 'modal'
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