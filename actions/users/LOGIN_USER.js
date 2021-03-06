const userModel = require("../../models/User");

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
    accountType: {
      type: "string",
      values: Object.values(userModel.statics.roles),
      required: true,
    },
  },
  exec: async (params, req) => {
    const { username, password, accountType } = params;
    const { users } = db;
    const now = new Date();

    const targetUser = await users.findOne({ username });
    if (!targetUser) {
      throw new Error(systemError.users.cannotFindUser);
    }
    if (targetUser.role !== accountType) {
      throw new Error(systemError.users.accountTypeIsInvalid);
    }

    const oldPassword = utils.decryptHashPassword({
      password: targetUser.password,
    });
    if (oldPassword !== password) {
      const moreThanMaxFailedLoginMinutes =
        new Date().getTime() >=
        new Date(
          utils.addMinutes(
            new Date(targetUser.failedLogin.lastTry),
            Number(env.var.maxFailedLoginMinutes)
          )
        ).getTime();

      if (moreThanMaxFailedLoginMinutes) {
        targetUser.failedLogin.count = 1;
        targetUser.failedLogin.lastTry = now;

        await services.users.updateUser({ user: targetUser });
        throw new Error(systemError.users.cannotFindUser);
      } else {
        if (
          targetUser.failedLogin.count < Number(env.var.maxFailedLoginCount)
        ) {
          targetUser.failedLogin.count += 1;
          targetUser.failedLogin.lastTry = now;

          await services.users.updateUser({ user: targetUser });
          throw new Error(systemError.users.cannotFindUser);
        } else {
          throw new Error(systemError.users.tryAgainInAFewMinutes);
        }
      }
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
    const newToken = utils.generateNewToken({ guid: targetUser.guid });

    targetUser.lastSeen = now;
    targetUser.failedLogin = { count: 0, lastTry: now };

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
