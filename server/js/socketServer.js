var io = require('socket.io')();

module.exports = {};
module.exports.listen = function (port) {
    console.log('socket io listening to ', port);
    io.listen(port);
};
module.exports.io = io;
