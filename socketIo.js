module.exports = async () => {
  io.on("connection", (client) => {
    client.emit("welcome");
    client.on("registerMe", registerMe);
    client.on("disconnect", onDisconnect);

    function registerMe(data) {
      socketsList.push({
        userId: data.userId,
        socket: client,
        clientId: client.id,
      });
    }

    // Handle a disconnection from the client
    function onDisconnect() {
      socketsList = socketsList.filter((s) => s.clientId !== client.id);
      client.removeListener("disconnect", onDisconnect);
    }
  });
};
