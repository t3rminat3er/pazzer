App.LoginController = EmberSockets.extend({
    name: null,
    password: null,

    init: function() {
        this._super();
    },

    sockets: {
        loggedIn: function (user) {
            console.log('user', user);
            this.set('user', user);
            this.transitionToRoute('lobby');
        }  
    },
    
    actions: {
        login: function () {
            this.socket.emit('login', {
                name: this.get('name'),
                password: this.get('password')
            });
        },
        guestlogin: function () {
            this.socket.emit('guestLogin');
        }
    },

    user: {},
    loginFailed: false,
    isProcessing: false
});