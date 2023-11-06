import createChat from "./chat.js";

const list = document.getElementById("participants");
const button = document.getElementById("send");
const chatMessages = document.getElementById("chat");

button.addEventListener("click", () => {
  console.log(`participant send-message`);
  const participantId = socket.id;
  socket.emit(
    "send-message",
    document.getElementById("text").value,
    participantId
  );
  document.getElementById("text").value = "";
});

text.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    button.click();
  }
});
const chat = createChat();

const socket = io();

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
      console.log(
        element,
        chat.state.participantColor,
        chat.state.participantColor[element]
      );
      para.style.backgroundColor = chat.state.participantColor[element];
      para.innerText = element;
      para.className = "listName";
      list.appendChild(para);
    } else if (element == participantId) {
      const para = document.createElement("p");
      para.id = element;
      para.style.backgroundColor = "lightgreen";
      para.innerText = element;
      para.className = "listName";
      list.appendChild(para);
    }
  });

  state["chat"].forEach((element) => {
    const para = document.createElement("div");
    const para2 = document.createElement("div");

    para.className = "your-message";
    para2.className = "message";
    para2.innerText = element[1];
    if (chat.state.participantColor[element[0]] == undefined) {
      para2.style.backgroundColor = "lightblue";
    } else {
      para2.style.backgroundColor = chat.state.participantColor[element[0]];
    }
    para.appendChild(para2);
    chatMessages.appendChild(para);
  });
});

socket.on("add-participant", (command) => {
  const participantId = socket.id;
  console.log(`Receiving ${command.type} -> ${command.participantId}`);

  chat.addParticipant(command);

  if (command.participantId != participantId) {
    const para = document.createElement("p");
    const id = command.participantId;
    para.id = id;
    const chat1 = chat.state.participantColor;
    para.style.backgroundColor = chat1[command.participantId];
    para.className = "listName";
    para.innerText = id;
    list.appendChild(para);
  }
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
  const para2 = document.createElement("p");

  if (participantId == command.participantId) {
    para2.className = "my-messages";
    para.className = "my-message";
  } else {
    para.className = "your-message";
    para2.style.backgroundColor =
      chat.state.participantColor[command.participantId];
    para2.className = "message";
  }
  para2.innerText = command.command;
  para.appendChild(para2);
  chatMessages.appendChild(para);
});
