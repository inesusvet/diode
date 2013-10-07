var express = require('express');
var fs = require('fs');
var app = express.createServer();
var socket = require('socket.io');
var io = socket.listen(app);


var indexhtml;

fs.readFile('index.html', function(err, content) {
    indexhtml = content;
});

var index = function(request, response) {
    console.log('New request');
    response.writeHead(200);
    response.end(indexhtml);
};

app.route('/', index);


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

var new_connection = function(client) {
    console.log('New connection');

    init_new_client(client);
};

io.sockets.on('connection', new_connection);


app.listen(8080);
