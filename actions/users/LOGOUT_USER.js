module.exports = {
  permissions: [permissions.isAdmin, permissions.isUser],
  inputSchema: {},
  exec: async (params, req) => {
    const { user } = req;

    // EXPIRE THE TOKEN
    const now = new Date();
    user.token.expiredAt = now;

    // UPDATE USER
    await services.users.updateUser({ user });

    return null;
  },
};
