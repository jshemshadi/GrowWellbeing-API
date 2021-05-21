module.exports = {
  permissions: [permissions.isAdmin],
  inputSchema: {
    page: {
      type: "string",
    },
    limit: {
      type: "string",
    },
    sort: {
      type: "string",
    },
    search: {
      type: "string",
    },
  },
  exec: async (params, req) => {
    let { search = "", page = 1, limit = 100, sort = "" } = params;

    page = Number(page);
    limit = Number(limit);

    return services.users.getUsers({ search, page, limit, sort });
  },
};
