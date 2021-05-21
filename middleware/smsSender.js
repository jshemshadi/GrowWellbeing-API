const getToken = async () => {
  try {
    return utils.post(
      env.var.smsGetTokenUrl,
      {
        UserApiKey: env.var.smsUserApiKey,
        SecretKey: env.var.smsSecretKey,
      },
      {}
    );
  } catch (err) {}
};

const getMessageText = ({ type, data }) => {
  switch (type) {
    default:
      return `${data.text}`;
  }
};

module.exports = {
  sendSMS: async ({ type, data, to }) => {
    const response = await getToken();
    const { IsSuccessful, TokenKey, Message } = response;
    if (IsSuccessful) {
      try {
        const result = await utils.post(
          `${env.var.smsBaseUrl}MessageSend`,
          {
            messages: [getMessageText({ type, data })],
            MobileNumbers: to,
            LineNumber: env.var.smsLineNumber,
            SendDateTime: "",
            CanContinueInCaseOfError: "false",
          },
          {
            headers: {
              "x-sms-ir-secure-token": TokenKey,
            },
          }
        );
        return result;
      } catch (err) {}
    } else {
      return {
        isSuccess: false,
        data: null,
        msg: Message,
      };
    }
    return {
      isSuccess: true,
      data: null,
    };
  },
};
