module.exports = async () => {
  io.on("connection", (client) => {
    client.emit("welcome");
    client.on("registerMe", registerMe);
    client.on("disconnect", onDisconnect);

    async function registerMe(data) {
      const { token } = data;
      if (token) {
        const { users } = db;

        try {
          const { guid } = jwt.verify(token, env.var.tokenKey);
          const user = await users.findOne({ guid });
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
