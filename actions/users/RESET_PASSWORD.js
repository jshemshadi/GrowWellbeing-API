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
    password: {
      type: "string",
      required: true,
    },
  },
  exec: async (params, req) => {
    const { email, verificationCode, password } = params;
    const { users } = db;

    // FIND USER
    const targetUser = await users.findOne({ email });
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
      targetUser.token.passwordReset.code !== verificationCode ||
      new Date(targetUser.token.passwordReset.expiredAt).getTime() <=
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
    const newToken = utils.generateNewToken({ guid: targetUser.guid });

    targetUser.token.passwordReset.expiredAt = now;
    targetUser.password = hashPassword;

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
