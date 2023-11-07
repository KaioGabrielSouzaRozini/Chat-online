import express from "express";
import http from "http";
import createChat from "./src/chat.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

app.use(express.static("src"));

const chat = createChat();

chat.subscribe((command) => {
  sockets.emit(command.type, command);
});

sockets.on("connection", (socket) => {
  const participantId = socket.id;

  socket.emit("new-participant", participantId);

  socket.on("create-participant", (participant) => {
    chat.addParticipant({
      participantId: participant.id,
      participantName: participant.nome,
    });
    socket.emit("setup", chat.state);
  });

  socket.on("disconnect", () => {
    chat.removeParticipant({ participantId: participantId });
  });

  socket.on("send-message", (command, id) => {
    chat.sendMessage(command, id);
  });
});

server.listen(3000, () => {
  console.log(`> Server listening on port: http://localhost:3000`);
});
