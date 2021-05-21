module.exports = {
  // REGISTER NEW USER
  post_register: {
    method: "post",
    action: async (req, res) => {
      const result = await actions.users.REGISTER_NEW_USER.run(req, req.body);
      utils.checkStatus({ req, res, result });
    },
  },
};
