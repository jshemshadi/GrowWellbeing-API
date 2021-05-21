module.exports = {
  permissions: [permissions.isAdmin, permissions.isUser],
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
      roles,
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
      roles,
    };
  },
};
