import createChat from "./chat.js";

const list = document.getElementById("participants");
const button = document.getElementById("send");
const chatMessages = document.getElementById("chat");

const chat = createChat();

const socket = io();

button.addEventListener("click", () => {
  console.log(`participant send-message`);
  const participantId = socket.id;
  socket.emit(
    "send-message",
    document.getElementById("text").value,
    participantId
  );
});

socket.on("connect", () => {
  const participantId = socket.id;
  console.log(`participant connected on client with id; ${participantId}`);
});

socket.on("setup", (state) => {
  const participantId = socket.id;
  chat.setState(state);

  state["participantIds"].forEach((element) => {
    if (element != participantId) {
      const para = document.createElement("p");
      para.id = element;
      para.innerText = element;
      list.appendChild(para);
    } else if (element == participantId) {
      const para = document.createElement("p");
      para.id = element;
      para.style.color = "red";
      para.innerText = element;
      list.appendChild(para);
    }
  });

  state["chat"].forEach((element) => {
    const para = document.createElement("div");
    const para2 = document.createElement("div");

    para.className = "your-message";
    para2.className = "message";

    para2.innerText = element;
    para.appendChild(para2);
    chatMessages.appendChild(para);
  });
});

socket.on("add-participant", (command) => {
  const participantId = socket.id;
  console.log(`Receiving ${command.type} -> ${command.participantId}`);

  if (command.participantId != participantId) {
    const para = document.createElement("p");
    para.id = command.participantId;
    para.innerText = command.participantId;
    list.appendChild(para);
  }

  chat.addParticipant(command);
});

socket.on("remove-participant", (command) => {
  console.log(`Receiving ${command.type} -> ${command.participantId}`);

  const removeparticipant = document.getElementById(command.participantId);
  list.removeChild(removeparticipant);

  chat.removeParticipant(command);
});
socket.on("send-message", (command) => {
  const participantId = socket.id;
  console.log(`Receiving ${command.type} -> ${command.participantId}`);

  const para = document.createElement("div");
  const para2 = document.createElement("div");
  if (participantId == command.participantId) {
    para2.className = "my-messages";
    para.className = "my-message";
  } else {
    para.className = "your-message";
    para2.className = "message";
  }
  para2.innerText = command.command;
  para.appendChild(para2);
  chatMessages.appendChild(para);
});
