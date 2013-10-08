var express = require('express');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var socket = require('socket.io');
var io = socket.listen(server);

server.listen(process.env.PORT, 10, process.env.IP);

var indexhtml;

fs.readFile('index.html', function(err, content) {
    indexhtml = content;
});

var index = function(request, response) {
    console.log('New request');
    response.writeHead(200);
    response.end(indexhtml);
};

app.get('/', index);


var init_new_client = function(client) {
    client.on('join', function(username) {
        console.log('User connected: ' + username);
        client.set('username', username);
    });
    client.on('update', function(payload) {
        console.log('Code was updated!');
        client.broadcast.emit('update', payload);
    });
};

var new_connection = function(client_socket) {
    console.log('New connection');

    init_new_client(client_socket);
};

io.sockets.on('connection', new_connection);
