const userModel = require("../../models/User");

module.exports = {
  permissions: [permissions.isAdmin],
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
    role: {
      type: "string",
      enum: Object.values(userModel.statics.roles),
      required: true,
    },
  },
  exec: async (params, req) => {
    let { firstName, lastName, mobile, email, username, password, role } =
      params;

    email = email.trim();
    const isValidEmail = utils.validateEmail({ email });
    if (!isValidEmail) {
      throw new Error(systemError.users.notValidEmaiAddress);
    }

    const isValidMobile = utils.validateMobile({ mobile });
    if (!isValidMobile) {
      throw new Error(systemError.users.notValidMobileNumber);
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
      role,
      status: {
        isTrash: false,
        isSuspend: false,
        isActive: false,
      },
      token: {
        verification: {
          code: "EXPIRED_CODE",
          expiredAt: now,
          count: 0,
          lastTry: now,
        },
        passwordReset: {
          code: "EXPIRED_CODE",
          expiredAt: now,
          count: 0,
          lastTry: now,
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
      role: resultRole,
      username: resultUsername,
    } = result.ops[0];
    return {
      createdAt: resultCreatedAt,
      firstName: resultFirstName,
      lastName: resultLastName,
      mobile: resultMobile,
      email: resultEmail,
      guid: resultGuid,
      role: resultRole,
      username: resultUsername,
    };
  },
};
