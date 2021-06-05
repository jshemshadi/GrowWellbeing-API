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
    const now = new Date();

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

    // CREATE TOKEN
    const newToken = utils.generateNewToken({ guid: targetUser.guid });

    targetUser.status.isActive = true;
    targetUser.lastSeen = now;
    targetUser.failedLogin = { count: 0, lastTry: now };
    targetUser.token.verification.code = "EXPIRED_TOKEN";
    targetUser.token.verification.expiredAt = now;

    // UPDATE USER
    const result = await services.users.updateUser({ user: targetUser });
    if (result.modifiedCount === 0) {
      throw new Error(systemError.users.cannotUpdateUser);
    }

    const {
      firstName: resultFirstName,
      lastName: resultLastName,
      mobile: resultMobile,
      email: resultEmail,
      guid: resultGuid,
      role: resultRole,
      username: resultUsername,
      avatar: resultAvatar,
      status: resultStatus,
    } = targetUser;
    return {
      firstName: resultFirstName,
      lastName: resultLastName,
      mobile: resultMobile,
      email: resultEmail,
      guid: resultGuid,
      role: resultRole,
      username: resultUsername,
      avatar: resultAvatar,
      status: resultStatus,
      token: newToken,
    };
  },
};
