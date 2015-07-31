var port = 34251;

var io = require('socket.io').listen(port);
console.log('socket io listening to ', port);

var login = require('./login.js');


io.sockets.on('connection', function (socket) {
    console.log('A user has connected', socket.request.connection._peername);
    socket.on('disconnect', function() {
        console.log("DISC");
    });
    login.listen(socket);
});
