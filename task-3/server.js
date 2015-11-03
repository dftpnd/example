var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

io.on('connection', function (socket) {
    users.push(socket.id);

    socket.on('webrtc', function (msg) {
        socket.broadcast.emit('webrtc', msg);
    });

    socket.on('webrtc-prepare', function () {
        if (users.length > 1)
            socket.emit('webrtc-handshake', {
                initiator: true
            });

    });

    socket.on('webrtc-ready', function () {
        socket.broadcast.emit('webrtc-handshake', {
            initiator: false
        });
    });


    socket.on('disconnect', function () {
        var currntIndex = users.indexOf(socket.id)
        users.splice(currntIndex, 1);
    });

});


http.listen(3000, function () {
    console.log('listening on *:3000');
});

