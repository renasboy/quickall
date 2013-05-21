var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(8081);

app.get('/', function (req, res) {
  var room = (new Date()).getTime().toString(16).substr(-8);
  res.redirect('/' + room);
});

app.get('/holla.js', function (req, res) {
  res.sendfile(__dirname + '/holla.js');
});

app.get('/:room', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var cli = {};
io.sockets.on('connection', function (socket) {
    socket.on('join', function (room) {
        var nick = (new Date()).getTime().toString(16).substr(-8);

        socket.on('disconnect', function () {
            delete cli[room][nick];
        });

        if (!cli[room]) {
            cli[room] = {};
        }

        socket.join(room);

        socket.emit('online', { me: nick, others: cli[room] });

        cli[room][nick] = nick;
    });
});
