const passport = require("passport");
const BearerStrategy = require("passport-http-bearer");

module.exports = async (app) => {
  passport.use(
    new BearerStrategy(async (token, done) => {
      const { users } = db;
      try {
        const user = await users.findOne({
          "token.code": token,
        });
        const isExpiredToken =
          new Date(user.token.expiredAt).getTime() < new Date().getTime();

        return done(null, user, isExpiredToken);
      } catch (err) {
        return done(new Error("UNAUTHORIZED"));
      }
    })
  );

  app.use((req, res, next) => {
    passport.authenticate(
      "bearer",
      { session: false },
      (err, user, isExpiredToken) => {
        if (err || !user) {
          return next();
        }

        req.user = user;
        req.isExpiredToken = isExpiredToken;

        return next();
      }
    )(req, res, next);
  });
};
