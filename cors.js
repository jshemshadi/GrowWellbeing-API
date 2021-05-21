const cors = require("cors");

module.exports = (app) => {
  app.use(
    cors({
      origin: "*",
      methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: 86400,
      credentials: false,
    })
  );

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, email, username"
    );
    next();
  });
};
