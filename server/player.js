
function Player(socket) {
    this.user = socket.user;
    this.socket = socket;
    this.handDeck = [];
    this.isHolding = false;
    this.total = 0;
    this.match = {};
    this.turn = false;
};

module.exports = Player;

