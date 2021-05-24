const userModel = require("../../models/User");

module.exports = {
  anonymouse: true,
  inputSchema: {
    firstName: {
      type: "string",
      required: true,
    },
    lastName: {
      type: "string",
      required: true,
    },
    mobile: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
    },
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
    let { firstName, lastName, mobile, email, username, password } = params;

    email = email.trim();
    const isValidEmail = utils.validateEmail({ email });
    if (!isValidEmail) {
      throw new Error(systemError.user.notValidEmaiAddress);
    }

    const isValidMobile = utils.validateMobile({ mobile });
    if (!isValidMobile) {
      throw new Error(systemError.user.notValidMobileNumber);
    }

    // FIND DUPLICATE USER
    const duplicateUser = await services.users.findDuplicate({
      username,
    });
    if (duplicateUser) {
      throw new Error(systemError.users.duplicateUser);
    }

    // CHECK PASSWORD
    const isStrongPassword = utils.isStrongPassword({ password });
    if (!isStrongPassword) {
      throw new Error(systemError.users.passwordNotStrong);
    }

    // CREATE NEW USER OBJECT
    const now = new Date();
    const hashPassword = utils.createHashPassword({ password });
    const guid = utils.generateGUID();

    const newUser = {
      createdAt: now,
      updatedAt: now,
      lastSeen: now,
      firstName,
      lastName,
      mobile,
      email,
      username,
      password: hashPassword,
      guid,
      roles: [userModel.statics.roles.User],
      status: {
        isTrash: false,
        isSuspend: false,
        isActive: false,
      },
      token: {
        verification: {
          code: utils.generateNewVerificationCode(4),
          expiredAt: utils.addHours(
            now,
            Number(env.var.verificationExpireHours)
          ),
        },
        passwordReset: {
          code: "EXPIRED_CODE",
          expiredAt: now,
        },
      },
      failedLogin: { count: 0, lastTry: now },
    };

    // INSERT THE USER IN DATA BASE
    const result = await services.users.addNewUser({ user: newUser });
    if (result.insertedCount === 0) {
      throw new Error(systemError.users.cannotInsertNewUser);
    }

    const {
      createdAt: resultCreatedAt,
      firstName: resultFirstName,
      lastName: resultLastName,
      mobile: resultMobile,
      email: resultEmail,
      guid: resultGuid,
      roles: resultRoles,
      username: resultUsername,
    } = result.ops[0];
    return {
      createdAt: resultCreatedAt,
      firstName: resultFirstName,
      lastName: resultLastName,
      mobile: resultMobile,
      email: resultEmail,
      guid: resultGuid,
      roles: resultRoles,
      username: resultUsername,
    };
  },
};
