export default function createChat() {
  const state = {
    participantIds: [],
    chat: [],
  };
  const observers = [];

  function setState(newState) {
    Object.assign(state, newState);
  }

  function addParticipant(command) {
    const participantId = command.participantId;
    state.participantIds.push(participantId);

    notifyAll({
      type: "add-participant",
      participantId: participantId,
    });
  }

  function removeParticipant(command) {
    const participantId = command.participantId;
    delete state.participantIds[participantId];

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
    state.chat.push(command);
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
