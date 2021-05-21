module.exports = async () => {
  io.on("connection", (client) => {
    client.emit("welcome");
    client.on("registerMe", registerMe);
    client.on("disconnect", onDisconnect);

    async function registerMe(data) {
      const { token } = data;
      if (token) {
        const { users } = db;
        const now = new Date();

        try {
          const user = await users.findOne({
            "status.isTrash": false,
            "status.isSuspend": false,
            "status.isActive": true,
            "token.code": token,
            "token.expiredAt": { $gt: now },
          });
          if (user) {
            socketsList.push({
              userGUID: user.guid,
              socket: client,
              clientId: client.id,
            });
          }
        } catch (err) {}
      }
    }

    // Handle a disconnection from the client
    function onDisconnect() {
      socketsList = socketsList.filter((s) => s.clientId !== client.id);
      client.removeListener("disconnect", onDisconnect);
    }
  });
};
