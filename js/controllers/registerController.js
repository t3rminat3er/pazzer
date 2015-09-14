App.RegisterController = EmberSockets.extend({
    name: null,
    password: null,

    init: function() {
        this._super();
    },
    
    actions: {
        register: function () {
            this.socket.emit('register', {
                name: this.get('name'),
                password: this.get('password')
            });
        }
    },

    user: {}
});