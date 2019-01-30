exports = module.exports = function(io) {
  // Set socket.io listeners.
  io.on('connection', (socket) => {
    console.log('a user connected');

    // On conversation entry, join broadcast channel
    socket.on('enter conversation', (body) => {
      socket.join(body._id);
      io.sockets.in(body._id).emit('refresh presence', body.email);
      console.log('joined conversation with id: ' + body._id);
    });

    socket.on('leave conversation', (conversation) => {
      const { _id } = conversation;
      socket.leave(_id);
      console.log('left conversation with id: ' + _id);
    });

    socket.on('new message', (conversation) => {
      console.log('new message: ' + conversation._id);
      io.sockets.in(conversation._id).emit('refresh messages', conversation);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
