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
    password: {
      type: "string",
      required: true,
    },
  },
  exec: async (params, req) => {
    const { username, verificationCode, password } = params;
    const { users } = db;

    // FIND USER
    const targetUser = await users.findOne({ username });
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

    if (
      targetUser.verification.code !== verificationCode ||
      new Date(targetUser.verification.expiredAt).getTime() <=
        new Date().getTime()
    ) {
      throw new Error(systemError.users.invalidVerificationCode);
    }

    // CHECK PASSWORD
    const isStrongPassword = utils.isStrongPassword({ password });
    if (!isStrongPassword) {
      throw new Error(systemError.users.passwordNotStrong);
    }

    const now = new Date();
    const hashPassword = utils.createHashPassword({ password });
    const newToken = utils.generateNewToken(32, targetUser.guid);

    targetUser.verification.expiredAt = now;
    targetUser.password = hashPassword;

    targetUser.token.code = newToken;
    targetUser.token.expiredAt = utils.addHours(
      now,
      Number(env.var.tokenExpireHours)
    );
    targetUser.lastSeen = now;

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
      roles: resultRoles,
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
      roles: resultRoles,
      username: resultUsername,
      avatar: resultAvatar,
      status: resultStatus,
      token: newToken,
    };
  },
};