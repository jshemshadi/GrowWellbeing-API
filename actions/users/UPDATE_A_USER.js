const userModel = require("../../models/User");

module.exports = {
  permissions: [permissions.isAdmin],
  inputSchema: {
    userGUID: {
      type: "string",
      required: true,
    },
    firstName: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    mobile: {
      type: "string",
    },
    email: {
      type: "string",
    },
    password: {
      type: "string",
    },
    roles: {
      type: "array",
      items: {
        type: "string",
        enum: Object.values(userModel.statics.roles),
      },
    },
    isTrash: {
      type: "bool",
    },
    isSuspend: {
      type: "bool",
    },
    isActive: {
      type: "bool",
    },
  },
  exec: async (params, req) => {
    let {
      userGUID,
      firstName = "",
      lastName = "",
      mobile = "",
      email = "",
      password = "",
      roles = [],
      isTrash,
      isSuspend,
      isActive,
    } = params;
    const { users } = db;

    const targetUser = await users.findOne({ guid: userGUID });
    if (!targetUser) {
      throw new Error(systemError.users.cannotFindUser);
    }

    let needUpdate = false;

    if (firstName.length && firstName !== targetUser.firstName) {
      targetUser.firstName = firstName;
      needUpdate = true;
    }
    if (lastName.length && lastName !== targetUser.lastName) {
      targetUser.lastName = lastName;
      needUpdate = true;
    }
    if (mobile.length && mobile !== targetUser.mobile) {
      targetUser.mobile = mobile;
      needUpdate = true;
    }
    if (email.length && email !== targetUser.email) {
      targetUser.email = email;
      needUpdate = true;
    }
    if (password.length) {
      // CHECK PASSWORD
      const isStrongPassword = utils.isStrongPassword({ password });
      if (!isStrongPassword) {
        throw new Error(systemError.users.passwordNotStrong);
      }

      const oldPassword = utils.decryptHashPassword({
        password: targetUser.password,
      });
      if (password !== oldPassword) {
        const hashPassword = utils.createHashPassword({ password });
        targetUser.password = hashPassword;
        needUpdate = true;
      }
    }
    if (roles.length && !_.isEqual(roles, targetUser.roles)) {
      targetUser.roles = roles;
      needUpdate = true;
    }
    if (!_.isUndefined(isTrash)) {
      targetUser.status.isTrash = isTrash;
      needUpdate = true;
    }
    if (!_.isUndefined(isSuspend)) {
      targetUser.status.isSuspend = isSuspend;
      needUpdate = true;
    }
    if (!_.isUndefined(isActive)) {
      targetUser.status.isActive = isActive;
      needUpdate = true;
    }

    if (needUpdate) {
      const now = new Date();
      targetUser.updatedAt = now;

      const result = await services.users.updateUser({ user: targetUser });
      if (result.modifiedCount === 0) {
        throw new Error(systemError.users.cannotUpdateUser);
      }
    }

    const {
      createdAt: resultCreatedAt,
      updatedAt: resultUpdatedAt,
      lastSeen: resultLastSeen,
      firstName: resultFirstName,
      lastName: resultLastName,
      mobile: resultMobile,
      email: resultEmail,
      avatar: resultAvatar,
      username: resultUsername,
      status: resultStatus,
      guid: resultGUID,
      roles: resultRoles,
    } = targetUser;
    return {
      createdAt: resultCreatedAt,
      updatedAt: resultUpdatedAt,
      lastSeen: resultLastSeen,
      firstName: resultFirstName,
      lastName: resultLastName,
      mobile: resultMobile,
      email: resultEmail,
      avatar: resultAvatar,
      username: resultUsername,
      status: resultStatus,
      guid: resultGUID,
      roles: resultRoles,
    };
  },
};
