const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    for (const key in rooms) {
      var room = rooms[key];
      for (const user of room.players) {
        if (user.user == socket.id) {
          room.players = room.players.filter((p) => p.user !== user.user);
          break;
        }
      }
      io.in(key).emit("update-players", room.players);
      if (room.players.length == 0) {
        delete rooms[key];
        break;
      }
    }
  });

  socket.on("make-move", (moves, player, room) => {
    const gameRoom = rooms[room];
    let newPlayer = player;
    for (const user of gameRoom.players) {
      if (user.user !== player) {
        newPlayer = user;
      }
    }
    io.in(room).emit("update-game", moves, newPlayer);
  });

  socket.on("player-won", (winner, room) => {
    io.in(room).emit("game-over", winner);
  });

  socket.on("gameDraw", (room) => {
    io.in(room).emit("gameDraw");
  });

  socket.on("player-ready", (roomId, userId, playerName, userSymbol) => {
    const getSymbol = (players) => {
      let symbol = "O";
      for (const user of players) {
        if (user.symbol && user.symbol === "O") {
          symbol = "X";
          return symbol;
        }
      }
      return symbol;
    };
    var room = rooms[roomId];
    for (const user of room.players) {
      if (user.user == userId) {
        user.isReady = true;
        user.symbol = userSymbol;
        user.name = playerName;
        break;
      }
    }
    io.in(roomId).emit("update-players", room.players, userSymbol);
  });

  socket.on("connect-room", (data, res) => {
    let clientsInRoom = 0;
    if (io.sockets.adapter.rooms.get(data.room)) {
      clientsInRoom = io.sockets.adapter.rooms.get(data.room).size;
    }
    if (clientsInRoom >= 2) {
      var err = new Error("Room already has 2 clients");
      err.name = "Room already has 2 clients";
      res(err);
    } else {
      socket.join(data.room);
      res(null, "Joined room: " + data.room);
      if (!rooms[data.room]) {
        rooms[data.room] = {};
        rooms[data.room].players = [{ user: socket.id, isReady: false }];
      } else {
        rooms[data.room].players.push({ user: socket.id, isReady: false });
      }
      io.in(data.room).emit("update-players", rooms[data.room].players);
    }
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
