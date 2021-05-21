const userModel = require("../models/User");

module.exports = async (req) => {
  const { user } = req;
  if (user) {
    return _.includes(user.roles, userModel.statics.roles.Admin);
  }
  return false;
};
