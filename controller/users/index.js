module.exports = {
  // REGISTER NEW USER
  post_register: {
    method: "post",
    action: async (req, res) => {
      const result = await actions.users.REGISTER_NEW_USER.run(req);
      utils.checkStatus({ req, res, result });
    },
  },
  // ADD NEW USER BY ADMIN
  post_: {
    method: "post",
    action: async (req, res) => {
      const result = await actions.users.ADD_NEW_USER.run(req);
      utils.checkStatus({ req, res, result });
    },
  },
  // GET USERS LIST BY ADMIN
  get_: {
    method: "get",
    action: async (req, res) => {
      const result = await actions.users.GET_USERS.run(req);
      utils.checkStatus({ req, res, result });
    },
  },
};
