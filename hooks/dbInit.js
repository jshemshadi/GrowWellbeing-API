const userModel = require("../models/User");

module.exports = async () => {
  const { users } = db;

  let adminUser = await users.findOne({ username: "admin" });
  if (!adminUser) {
    const now = new Date();
    const hashPassword = utils.createHashPassword({ password: "Welcome110" });
    const guid = utils.generateGUID();

    adminUser = {
      createdAt: now,
      updatedAt: now,
      lastSeen: now,
      firstName: "main",
      lastName: "admin",
      mobile: "",
      email: "",
      username: "admin",
      password: hashPassword,
      guid,
      roles: [userModel.statics.roles.Admin],
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

    await services.users.addNewUser({ user: adminUser });
  }
};
