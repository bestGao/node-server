
var app = require('express')();

var server = app.listen(9966);
var io = require('socket.io').listen(server);
io.sockets.on('connection', (socket) => {
  console.log('连接成功')
})