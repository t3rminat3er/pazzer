App.CreateMatchController = Ember.Controller.extend({
    name: null,

    actions: {
        createMatch: function () {
            console.log(this.name);
            if (!this.name) {
                alert("Benenne das Spiel.");
                return;
            }
            this.socket.emit('match.create', this.name);
        }
    },

    sockets: {
        'match.joined': function (match) {
            this.send('closeModal');
            this.transitionTo('match', match.id);
        }
    }
});