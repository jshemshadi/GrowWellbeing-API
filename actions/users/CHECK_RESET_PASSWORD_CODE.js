module.exports = {
  anonymouse: true,
  inputSchema: {
    email: {
      type: "string",
      required: true,
    },
    verificationCode: {
      type: "string",
      required: true,
    },
  },
  exec: async (params, req) => {
    const { email, verificationCode } = params;
    const { users } = db;

    // FIND USER
    const targetUser = await users.findOne({
      email,
    });
    if (!targetUser) {
      throw new Error(systemError.users.cannotFindUser);
    }

    if (targetUser.status.isTrash) {
      throw new Error(systemError.users.accountWasTrashed);
    }

    if (targetUser.status.isSuspend) {
      throw new Error(systemError.users.accountWasSuspended);
    }

    if (!targetUser.status.isActive) {
      throw new Error(systemError.users.accountIsInActive);
    }

    return verificationCode === targetUser.token.passwordReset.code;
  },
};
