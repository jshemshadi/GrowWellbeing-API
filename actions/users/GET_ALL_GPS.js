module.exports = {
  permissions: [permissions.isAdmin],
  inputSchema: {},
  exec: async (params, req) => {
    return services.users.getAllGPs();
  },
};
