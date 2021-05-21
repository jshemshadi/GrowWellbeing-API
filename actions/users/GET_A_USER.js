module.exports = {
  permissions: [permissions.isAdmin],
  inputSchema: {
    userGUID: {
      type: "string",
      required: true,
    },
  },
  exec: async (params, req) => {
    let { userGUID } = params;

    return services.users.getUser({ userGUID });
  },
};
