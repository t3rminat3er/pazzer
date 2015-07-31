window.App = Ember.Application.create({
    Socket: EmberSockets.extend({
        host: 'localhost',
        port: 34251,
        controllers: ['login'],
        autoConnect: true
    }),
    LOG_TRANSITIONS: true, LOG_TRANSITIONS_INTERNAL: true
});