const { users } = db;

module.exports = {
  findDuplicate: async ({ username }) => {
    const query = { username };

    return users.findOne(query);
  },
  addNewUser: async ({ user }) => {
    return users.insertOne(user);
  },
};
