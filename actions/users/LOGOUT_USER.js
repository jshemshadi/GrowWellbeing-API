module.exports = {
  permissions: [permissions.isAdmin, permissions.isUser],
  inputSchema: {},
  exec: async (params, req) => {
    const { user } = req;

    // UPDATE USER
    await services.users.updateUser({ user });

    return null;
  },
};
