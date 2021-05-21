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
    const { firstName, lastName, mobile, email, username, password } = params;
    const { users } = db;

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
      status: {
        isTrash: false,
        isSuspend: false,
        isActive: false,
      },
      token: {
        code: "EXPIRED_TOKEN",
        expiredAt: now,
      },
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
      username: resultUsername,
    } = result.ops[0];
    return {
      createdAt: resultCreatedAt,
      firstName: resultFirstName,
      lastName: resultLastName,
      mobile: resultMobile,
      email: resultEmail,
      guid: resultGuid,
      username: resultUsername,
    };
  },
};