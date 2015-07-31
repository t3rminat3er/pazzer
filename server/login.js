var guests = [];

var onSocketDisconnect = function (socket) {
    console.log("disconnected", socket);
},

    getGuestName = function(i) {
        return "Guest " + i;
    },

    listen = function (socket) {
        console.log("login listening");
        
        socket.on('disconnect', onSocketDisconnect);
        socket.on('guestLogin', function () {
            var guest = {
                socket: socket
            };
            var i = 1;
            for (; i < guests.length; i++) {
                if (!guests[i]) {
                    break;
                }
            }
            guest.name = getGuestName(i);
            guests[i] = guest;
            socket.emit('loggedIn', guest.name);
        });
    };


module.exports = {};
module.exports.listen = listen;