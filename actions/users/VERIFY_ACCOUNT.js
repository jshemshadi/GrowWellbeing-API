module.exports = {
  anonymouse: true,
  inputSchema: {
    username: {
      type: "string",
      required: true,
    },
    verificationCode: {
      type: "string",
      required: true,
    },
  },
  exec: async (params, req) => {
    const { username, verificationCode } = params;
    const { users } = db;
    const now = new Date();

    // FIND USER
    const targetUser = await users.findOne({
      username,
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

    if (targetUser.status.isActive) {
      throw new Error(systemError.users.accountAlreadyActivated);
    }

    if (
      targetUser.token.verification.code !== verificationCode ||
      new Date(targetUser.token.verification.expiredAt).getTime() <=
        new Date().getTime()
    ) {
      throw new Error(systemError.users.invalidVerificationCode);
    }

    targetUser.status.isActive = true;
    targetUser.token.verification.code = "EXPIRED_TOKEN";
    targetUser.token.verification.expiredAt = now;

    // UPDATE USER
    const result = await services.users.updateUser({ user: targetUser });
    if (result.modifiedCount === 0) {
      throw new Error(systemError.users.cannotUpdateUser);
    }

    return null;
  },
};
