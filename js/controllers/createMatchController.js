App.CreateMatchController = Ember.Controller.extend({
    name: null,

    actions: {
        createMatch: function () {
            if (!this.name) {
                alert("Benenne das Spiel.");
            }
            this.socket.emit('createMatch', name);
        }
    },

    sockets: {
        matchCreated: function (match) {
            this.send('closeModal');
            this.transitionTo('match', match.id);
        }
    }
});