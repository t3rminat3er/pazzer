App.LoginController = Ember.Controller.extend({
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
            this.user = this.getUniqueGuest();
            this.transitionTo('lobby', this.user.name);
        }
    },

    getUniqueGuest: function () {
        var user = { id: 0, name: "Guest " + 1, isGuest: true };
        return user;
    },
    user: {},
    loginFailed: false,
    isProcessing: false
});