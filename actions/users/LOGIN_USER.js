module.exports = {
  anonymouse: true,
  inputSchema: {
    username: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },
  exec: async (params, req) => {
    const { username, password } = params;
    const { users } = db;

    const targetUser = await users.findOne({ username });
    if (!targetUser) {
      throw new Error(systemError.users.cannotFindUser);
    }

    const oldPassword = utils.decryptHashPassword({
      password: targetUser.password,
    });
    if (oldPassword !== password) {
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

    // CREATE TOKEN
    const now = new Date();
    const newToken = utils.generateNewToken(32, targetUser.guid);

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
