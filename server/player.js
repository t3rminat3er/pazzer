
var events = require('events'),
    util = require('util'),

    Player = function (socket) {
        this.user = socket.user;
        this.socket = socket;
        this.handDeck = [];
        this.isHolding = false;
        this.total = 0;
        this.match = {};
        this.turn = false;
        this.openCards = [];
        this.setsWon = 0;
        
        this.emitEvent = function (event, content, socket) {
            if (!socket || socket === this.socket) {
                // only emit if it is intended to be emitted as self
                this.emit(event, content);
                socket = this.socket;
            } else {
                // use provided socket
            }
            event = this.user.id + '.' + event;
            console.log('player.emit: ', event, content);
            socket.emit(event, content);
        };
    };

util.inherits(Player, events.EventEmitter);
module.exports = Player;

