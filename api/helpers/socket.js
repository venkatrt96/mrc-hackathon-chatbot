exports.bind = (io) => {
  io.on('connection', (socket) => {
    socket.on('subscribe', (data) => {
      console.log(data, 'subscribed');
      socket.join(data);
    });

    socket.on('unsubscribe', (data) => {
      console.log(data, 'unsubscribed');
      socket.leave(data);
    });

    socket.on('message', (data, id) => {
      console.log(data, id);
      // io.emit('send', data);
      io.to(id).emit('send', data);
    });
    socket.on('updateUsers', (data) => {
      io.emit('chatUsers', data);
    });
  });
};
