// const fs = require("fs");
// const https = require("https");
const http = require("http");
// const privateKey = fs.readFileSync("sslcert/server.key", "utf8");
// const certificate = fs.readFileSync("sslcert/server.crt", "utf8");
// const credentials = { key: privateKey, cert: certificate };
const express = require("express");
const bodyParser = require("body-parser");
const globals = require("./globals");
const socketIo = require("./socketIo");
const routes = require("./routes");
const cors = require("./cors");
const app = express();

module.exports = async () => {
  routes(app);
  cors(app);
  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
  app.use(bodyParser.json());

  // var server = https.createServer(credentials, app);
  var server = http.createServer(app);
  const Io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    },
  });

  await globals(app, Io);
  await socketIo();

  server.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });
};
