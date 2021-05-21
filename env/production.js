module.exports = {
  port: {
    type: Number,
    value: process.env.PORT,
  },
  database: {
    type: "JSON",
    value: {
      url: process.env.MONGO_URL,
      dbName: process.env.MONGO_DB_NAME,
      username: process.env.MONGO_USER,
      password: process.env.MONGO_PASS,
      authSource: process.env.MONGO_AUTH_SOURCE,
    },
  },
  var: {
    type: "JSON",
    value: {
      passwordKey: process.env.PASSWORD_KEY,
      tokenExpireHours: process.env.TOKEN_EXPIRE_HOURS,
      verificationExpireHours: process.env.VERIFICATION_EXPIRE_HOURS,

      mailSenderHost: process.env.MAIL_SENDER_HOST,
      mailSenderPort: process.env.MAIL_SENDER_PORT,
      mailSenderSecure: process.env.MAIL_SENDER_SECURE,
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
