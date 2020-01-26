const express = require('express');
const cors = require('cors');
const app = express();
const whitelist = ['http://localhost:4200', 'http://example2.com'];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

var server = app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`));

const io = require('socket.io').listen(server);
//io.set('transports', ['websocket']);

var allClients = [];

io.on('connection', (socket)=>{
    console.log('connected');
    allClients.push(socket);

   socket.on('disconnect', function() {
      console.log('Got disconnect!');

      var i = allClients.indexOf(socket);
      allClients.splice(i, 1);
   });

    socket.on('new-message', (message) => {
        console.log(message);
        io.emit('new-message',message);
      });

      socket.on('error', function (err) {
        console.log(err);
    });
});