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
      tokenKey: process.env.TOKEN_KEY || "token_key",
      tokenExpireTime: process.env.TOKEN_EXPIRE_TIME || "1h",
      verificationExpireHours: process.env.VERIFICATION_EXPIRE_HOURS || "1",
      maxFailedLoginCount: process.env.MAX_FAILED_LOGIN_COUNT || "3",
      maxFailedLoginMinutes: process.env.MAX_FAILED_LOGIN_MINUTES || "10",

      mailSenderHost: process.env.MAIL_SENDER_HOST || "smtp.gmail.com",
      mailSenderPort: process.env.MAIL_SENDER_PORT || "587",
      mailSenderSecure: process.env.MAIL_SENDER_SECURE || "false",
      mailSenderUsername: process.env.MAIN_SENDER_USERNAME,
      mailSenderPassword: process.env.MAIL_SENDER_PASSWORD,

      smsGetTokenUrl: process.env.SMS_GET_TOKEN_URL,
      smsUserApiKey: process.env.SMS_USER_API_KEY,
      smsSecretKey: process.env.SMS_SECRET_KEY,
      smsBaseUrl: process.env.SMS_BASE_URL,
      smsLineNumber: process.env.SMS_LINE_NUMBER,
    },
  },
};
