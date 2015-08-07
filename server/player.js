
function Player(socket) {
    this.user = socket.user;
    this.socket = socket;
    this.handDeck = [];
};

module.exports = Player;

