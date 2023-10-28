const socketIo = require("socket.io");
// const cors = require("cors");

function webSocketController(server) {
  const io = socketIo(server, {
    cors: {
      origin: "*", // Allow requests from any origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true, // Allow credentials (e.g., cookies, HTTP authentication) to be sent with requests
    },
  });

  io.engine.on("headers", (headers, request) => {
    // Установите заголовок CORS вручную для запросов polling
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "GET,HEAD,PUT,PATCH,POST,DELETE";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Allow-Credentials"] = true;
  });

  // io.use(cors());

  io.on("connection", (socket) => {
    // console.log("New client connected: " + socket.id);
    socket.on("user-connected", (user) => {
      socket.broadcast.emit("user-connected", user);
      // io.emit("user-connected", user);
    });
    socket.on("new-message", (message) => {
      // io.emit("new-message", message); // all users
      socket.broadcast.emit("new-message", message); // all without sender
    });
  });

  return io;
}

module.exports = webSocketController;
