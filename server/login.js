var guests = [];

var onSocketDisconnect = function () {
    for (var i = 0; i < guests.length; i++) {
        var guest = guests[i];
        if (guest) {
            if (guest.socket === this) {
                console.log("guest disconnected", guest.name);
                guests[i] = null;
                return;
            }
        }
    }
},

    getGuestName = function (i) {
        return "Guest " + i;
    },

    onGuestLogin = function () {
        var guest = {
            socket: this
        };
        var i = 1;
        for (; i < guests.length; i++) {
            if (!guests[i]) {
                break;
            }
        }
        guest.name = getGuestName(i);
        guests[i] = guest;
        this.emit('loggedIn', {
            name: guest.name,
            isGuest: true
        });
    },

    listen = function (socket) {
        socket.on('disconnect', onSocketDisconnect);
        socket.on('guestLogin', onGuestLogin);
        // TODO user login
    };


module.exports = {};
module.exports.listen = listen;