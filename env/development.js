module.exports = {
  port: {
    type: Number,
    value: process.env.PORT || "8000",
  },
  database: {
    type: "JSON",
    value: {
      url: process.env.MONGO_URL || "mongodb://localhost:27017/",
      dbName: process.env.MONGO_DB_NAME || "Grow_Wellbeing_dev",
      username: process.env.MONGO_USER,
      password: process.env.MONGO_PASS,
      authSource: process.env.MONGO_AUTH_SOURCE,
    },
  },
  var: {
    type: "JSON",
    value: {
      passwordKey: process.env.PASSWORD_KEY || "password_key",
      tokenExpireHours: process.env.TOKEN_EXPIRE_HOURS || "1",
    },
  },
};
