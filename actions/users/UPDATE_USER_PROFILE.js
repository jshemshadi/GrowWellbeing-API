const userModel = require("../../models/User");

module.exports = {
  permissions: [permissions.isAdmin, permissions.isUser],
  inputSchema: {
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
    file: {
      type: "string",
    },
    password: {
      type: "string",
    },
  },
  exec: async (params, req) => {
    let {
      firstName = "",
      lastName = "",
      mobile = "",
      email = "",
      file = "",
      password = "",
    } = params;
    const { user } = req;

    let needUpdate = false;

    if (firstName.length && firstName !== user.firstName) {
      user.firstName = firstName;
      needUpdate = true;
    }
    if (lastName.length && lastName !== user.lastName) {
      user.lastName = lastName;
      needUpdate = true;
    }
    if (mobile.length && mobile !== user.mobile) {
      user.mobile = mobile;
      needUpdate = true;
    }
    if (email.length && email !== user.email) {
      user.email = email;
      needUpdate = true;
    }
    if (file.length && file !== user.avatar) {
      user.avatar = file;
      needUpdate = true;
    }
    if (password.length) {
      // CHECK PASSWORD
      const isStrongPassword = utils.isStrongPassword({ password });
      if (!isStrongPassword) {
        throw new Error(systemError.users.passwordNotStrong);
      }

      const oldPassword = utils.decryptHashPassword({
        password: user.password,
      });
      if (password !== oldPassword) {
        const hashPassword = utils.createHashPassword({ password });
        user.password = hashPassword;
        needUpdate = true;
      }
    }

    if (needUpdate) {
      const now = new Date();
      user.updatedAt = now;

      const result = await services.users.updateUser({ user });
      if (result.modifiedCount === 0) {
        throw new Error(systemError.users.cannotUpdateUser);
      }
    }

    const {
      firstName: resultFirstName,
      lastName: resultLastName,
      mobile: resultMobile,
      email: resultEmail,
      avatar: resultAvatar,
      username: resultUsername,
      status: resultStatus,
      guid: resultGUID,
      roles: resultRoles,
    } = user;
    return {
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
