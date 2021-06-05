const userModel = require("../models/User");

module.exports = async (req) => {
  const { user } = req;
  if (user) {
    return user.role === userModel.statics.roles.School;
  }
  return false;
};
