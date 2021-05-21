module.exports = {
  // REGISTER NEW USER
  post_register: {
    method: "post",
    action: async (req, res) => {
      const result = await actions.users.REGISTER_NEW_USER.run(req);
      utils.checkStatus({ req, res, result });
    },
  },
  // LOGIN USER
  post_login: {
    method: "post",
    action: async (req, res) => {
      const result = await actions.users.LOGIN_USER.run(req);
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
  // GET A USER BY ADMIN
  "get_:userGUID/profile": {
    method: "get",
    action: async (req, res) => {
      const result = await actions.users.GET_A_USER.run(req);
      utils.checkStatus({ req, res, result });
    },
  },
  // GET PROFILE
  get_profile: {
    method: "get",
    action: async (req, res) => {
      const result = await actions.users.GET_USER_PROFILE.run(req);
      utils.checkStatus({ req, res, result });
    },
  },

  // UPDATE A USER BY ADMIN
  "patch_:userGUID/profile": {
    method: "patch",
    action: async (req, res) => {
      const result = await actions.users.UPDATE_A_USER.run(req);
      utils.checkStatus({ req, res, result });
    },
  },
  // UPDATE PROFILE
  patch_profile: {
    method: "patch",
    action: async (req, res) => {
      const result = await actions.users.UPDATE_USER_PROFILE.run(req);
      utils.checkStatus({ req, res, result });
    },
  },
};
