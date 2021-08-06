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

    // UPDATE USER
    await services.users.updateUser({ user });

    return null;
  },
};
