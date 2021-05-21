module.exports = {
  refreshsocketList: () => {
    socketsList = socketsList.filter((s) => s.socket && s.socket.connected);
  },
};
