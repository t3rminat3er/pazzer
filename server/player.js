
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
        
        this.emitEvent = function (event, content, socket) {
            console.log('player.super.emit: ', event, content);
            this.emit(event, content);
            if (!socket) {
                console.log("player emit socket using player socket");
                socket = this.socket;
            } else {
                console.log("player emit socket using provideds socket");
            }
            event = this.user.id + '.' + event;
            console.log('player.emit: ', event, content);
            socket.emit(event, content);
        };
    };

util.inherits(Player, events.EventEmitter);
module.exports = Player;

