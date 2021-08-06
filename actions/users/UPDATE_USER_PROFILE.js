const userModel = require("../../models/User");

module.exports = {
  permissions: [
    permissions.isAdmin,
    permissions.isGP,
    permissions.isSchool,
    permissions.isStaff,
  ],
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
    avatar: {
      type: "string",
    },
    oldPassword: {
      type: "string",
    },
    newPassword: {
      type: "string",
    },
  },
  exec: async (params, req) => {
    let {
      firstName = "",
      lastName = "",
      mobile = "",
      email = "",
      avatar = "",
      oldPassword = "",
      newPassword = "",
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
      const isValidMobile = utils.validateMobile({ mobile });
      if (!isValidMobile) {
        throw new Error(systemError.users.notValidMobileNumber);
      }

      user.mobile = mobile;
      needUpdate = true;
    }
    if (email.length && email !== user.email) {
      email = email.trim();
      const isValidEmail = utils.validateEmail({ email });
      if (!isValidEmail) {
        throw new Error(systemError.users.notValidEmaiAddress);
      }

      user.email = email;
      needUpdate = true;
    }
    if (avatar.length && avatar !== user.avatar) {
      user.avatar = avatar;
      needUpdate = true;
    }
    if (
      oldPassword.length &&
      newPassword.length &&
      oldPassword !== newPassword
    ) {
      const userOldPassword = utils.decryptHashPassword({
        password: user.password,
      });

      if (oldPassword === userOldPassword) {
        // CHECK PASSWORD
        const isStrongPassword = utils.isStrongPassword({
          password: newPassword,
        });
        if (!isStrongPassword) {
          throw new Error(systemError.users.passwordNotStrong);
        }

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
      role: resultRole,
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
      role: resultRole,
    };
  },
};
