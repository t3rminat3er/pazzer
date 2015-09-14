
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
            var isPrivateAction;
            if (!socket || socket === this.socket) {
                // only emit if it is intended to be emitted as self
                socket = this.socket;
                isPrivateAction = true;
            } else {
                // use provided socket
            }
            var userIdEvent = this.user.id + '.' + event;
            socket.emit(userIdEvent, content);
            
            if (isPrivateAction) {
                this.emit(event, content);
            }
        };
        
        this.toJSON = function () {
            return {
                id: this.user.id,
                name: this.user.name,
                openCards: this.openCards,
                setsWon: this.setsWon,
                total: this.total
            }
        }
    };

util.inherits(Player, events.EventEmitter);
module.exports = Player;

