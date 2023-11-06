export default function createChat() {
  const state = {
    participantName: {},
    participantIds: [],
    participantColor: {},
    chat: [],
  };
  const observers = [];

  function setState(newState) {
    Object.assign(state, newState);
  }

  function addParticipant(command) {
    const participantId = command.participantId;

    const letters = "456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 12)];
    }
    state.participantIds.push(participantId);
    state.participantColor[participantId] = color;

    notifyAll({
      type: "add-participant",
      participantId: participantId,
      participantColor: color,
    });
  }

  function removeParticipant(command) {
    const participantId = command.participantId;
    delete state.participantColor[participantId];

    state.participantIds.forEach((element, index) => {
      if (element == participantId) {
        state.participantIds.splice(index, 1);
      }
    });

    notifyAll({
      type: "remove-participant",
      participantId: participantId,
    });
  }

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function sendMessage(command, id) {
    state.chat.push([id, command]);
    if (state.chat.length > 50) {
      state.chat.shift();
    }
    notifyAll({
      type: "send-message",
      command: command,
      participantId: id,
    });
  }

  return {
    sendMessage,
    addParticipant,
    removeParticipant,
    setState,
    subscribe,
    notifyAll,
    state,
  };
}
