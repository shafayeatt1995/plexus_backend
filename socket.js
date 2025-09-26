// socket.js
function socketServer(app) {
  const http = require("http");
  const server = http.createServer(app);
  const { Server } = require("socket.io");

  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:8080", process.env.BASE_URL],
      credentials: true,
    },
  });

  global.io = io;

  io.on("connection", (socket) => {
    socket.join("global-room");
  });

  return server;
}

module.exports = socketServer;
