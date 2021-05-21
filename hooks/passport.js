const passport = require("passport");
const BearerStrategy = require("passport-http-bearer");

module.exports = async (app) => {
  passport.use(
    new BearerStrategy(async (token, done) => {
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

        return done(null, user);
      } catch (err) {
        return done(new Error("UNAUTHORIZED"));
      }
    })
  );

  app.use((req, res, next) => {
    passport.authenticate("bearer", { session: false }, (err, user) => {
      if (err || !user) {
        return next();
      }

      req.user = user;

      return next();
    })(req, res, next);
  });
};
