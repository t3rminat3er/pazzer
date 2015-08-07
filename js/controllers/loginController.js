App.LoginController = EmberSockets.extend({
    
    init: function() {
        this._super();
    },

    sockets: {
        loggedIn: function(user) {
            this.set('user', user);
            this.transitionToRoute('lobby');
        }  
    },
    
    actions: {
        login: function () {
            console.log("login action clicked", loginFailed);

            // TODO handle login
            // source http://blog.trackets.com/2013/05/23/how-to-write-a-login-form.html
            //$.post("/login", {
            //    username: this.get("username"),
            //    password: this.get("password")
            //}).then(function () {
            //    this.set("isProcessing", false);
            //    document.location = "/welcome";
            //}.bind(this), function () {
            //    this.set("isProcessing", false);
            //    this.set("loginFailed", true);
            //}.bind(this));
        },
        guestlogin: function () {
            this.socket.emit('guestLogin');
        }
    },

    user: {},
    loginFailed: false,
    isProcessing: false
});