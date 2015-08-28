App.PlayersController = Ember.Controller.extend({

    onlinePlayers: [{ name: "TEST" }],

    init: function () {
        this._super();
        console.log(this, "init");
        this.socket.emit('getPlayers');
    },

    sockets: {
        onlinePlayers: function(players) {
            this.set('onlinePlayers', players);
        },
        playerCameOnline: function (user) {
            this.onlinePlayers.pushObject(user);
            console.warn("player came online", user);
        },

        playerWentOffline: function (user) {
            this.onlinePlayers.removeObject(this.onlinePlayers.findBy('id', user.id));
            console.warn("pplayerWentOffeline", user);
        }
    }

});