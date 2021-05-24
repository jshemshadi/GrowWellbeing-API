const passport = require("passport");
const BearerStrategy = require("passport-http-bearer");

module.exports = async (app) => {
  passport.use(
    new BearerStrategy(async (token, done) => {
      const { users } = db;

      try {
        const { guid } = jwt.verify(token, env.var.tokenKey);
        const user = await users.findOne({ guid });

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
