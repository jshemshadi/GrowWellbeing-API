module.exports = {
  permissions: [permissions.isAdmin, permissions.isStaff],
  inputSchema: {
    from: {
      type: "string",
    },
    to: {
      type: "string",
    },
    createAfter: {
      type: "string",
    },
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
    const { user } = req;
    let {
      search = "",
      page = 1,
      limit = 100,
      sort = "",
      from = "",
      to = "",
      createAfter = "",
    } = params;

    page = Number(page);
    limit = Number(limit);

    return services.appointments.getUserAppointments({
      userId: user.guid,
      role: user.role,
      search,
      page,
      limit,
      sort,
      from,
      to,
      createAfter,
    });
  },
};
