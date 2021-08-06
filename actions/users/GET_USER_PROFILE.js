module.exports = {
  permissions: [
    permissions.isAdmin,
    permissions.isGP,
    permissions.isSchool,
    permissions.isStaff,
  ],
  inputSchema: {},
  exec: async (params, req) => {
    const { user } = req;

    const {
      firstName,
      lastName,
      mobile,
      email,
      avatar,
      username,
      status,
      guid,
      role,
    } = user;
    return {
      firstName,
      lastName,
      mobile,
      email,
      avatar,
      username,
      status,
      guid,
      role,
    };
  },
};
