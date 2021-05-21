const { users } = db;

module.exports = {
  findDuplicate: async ({ username }) => {
    const query = { username };

    return users.findOne(query);
  },
  getUsers: async ({ search, page, limit, sort }) => {
    const query = [];
    if (search.length) {
      query.push({
        $match: {
          $or: [
            {
              username: {
                $regex: `${search}`,
                $options: "ig",
              },
            },
            {
              firstName: {
                $regex: `${search}`,
                $options: "ig",
              },
            },
            {
              lastName: {
                $regex: `${search}`,
                $options: "ig",
              },
            },
            {
              email: {
                $regex: `${search}`,
                $options: "ig",
              },
            },
            {
              mobile: {
                $regex: `${search}`,
                $options: "ig",
              },
            },
          ],
        },
      });
    }
    query.push({
      $project: {
        createdAt: 1,
        updatedAt: 1,
        lastSeen: 1,
        firstName: 1,
        lastName: 1,
        mobile: 1,
        email: 1,
        avatar: 1,
        username: 1,
        status: 1,
        guid: 1,
        roles: 1,
      },
    });

    const countQuery = _.cloneDeep(query);
    countQuery.push({
      $count: "count",
    });
    let totalCount = await users.aggregate(countQuery).toArray();
    if (totalCount && totalCount.length) {
      totalCount = totalCount[0].count;
    } else {
      totalCount = 0;
    }

    let sortFeild = "createdAt";
    let sortDir = "desc";
    if (sort.length && _.includes(sort, ",")) {
      const dir = sort.split(",")[0];
      const field = sort.split(",")[1];
      if (dir && field) {
        sortFeild = field;
        sortDir = dir;
      }
    }
    query.push({
      $sort: { [`${sortFeild}`]: sortDir === "asc" ? 1 : -1 },
    });
    if (limit && page) {
      query.push({ $skip: (page - 1) * limit });
      query.push({ $limit: limit });
    }
    const result = await users.aggregate(query).toArray();

    return { totalCount, users: result };
  },
  getUser: async ({ userGUID }) => {
    const user = await users.findOne({ guid: userGUID });
    if (!user) {
      return null;
    }

    const {
      createdAt,
      updatedAt,
      lastSeen,
      firstName,
      lastName,
      mobile,
      email,
      avatar,
      username,
      status,
      guid,
      roles,
    } = user;
    return {
      createdAt,
      updatedAt,
      lastSeen,
      firstName,
      lastName,
      mobile,
      email,
      avatar,
      username,
      status,
      guid,
      roles,
    };
  },

  addNewUser: async ({ user }) => {
    return users.insertOne(user);
  },

  updateUser: async ({ user }) => {
    return users.updateOne({ guid: user.guid }, { $set: user });
  },
};
