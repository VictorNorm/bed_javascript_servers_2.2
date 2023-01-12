const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const admin = io.of("/admin");

admin.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    admin.emit("chat message", msg);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/room1", (req, res) => {
  res.sendFile(__dirname + "/room1.html");
});

app.get("/room2", (req, res) => {
  res.sendFile(__dirname + "/room2.html");
});

admin.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data.room);
    admin
      .in(data.room)
      .emit("chat message", `New user joined ${data.room} room!`);
  });

  socket.on("chat message", (data) => {
    console.log(data);
    admin.in(data.room).emit("chat message", data.msg);
  });

  socket.on("disconnect", () => {
    admin.emit("chat message", "user disconnected");
  });
});

// io.on("connection", (socket) => {
//   socket.on("chat message", (msg) => {
//     io.emit("chat message", msg);
//   });
// });

server.listen(3000, () => {
  console.log("listening on *:3000");
});
