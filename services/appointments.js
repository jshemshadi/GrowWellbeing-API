const { appointments } = db;

module.exports = {
  findDuplicate: async ({ date, schoolId }) => {
    const query = { date, schoolId };

    return appointments.findOne(query);
  },
  getUserAppointments: async ({ userId, role, search, page, limit, sort }) => {
    const query = [];

    if (role === "gp") {
      query.push({ $match: { GPId: userId } });
    } else if (role === "school") {
      query.push({ $match: { schoolId: userId } });
    }

    if (search.length) {
      query.push({
        $match: {
          $or: [
            {
              gardianName: {
                $regex: `${search}`,
                $options: "ig",
              },
            },
            {
              address: {
                $regex: `${search}`,
                $options: "ig",
              },
            },
            {
              summary: {
                $regex: `${search}`,
                $options: "ig",
              },
            },
            {
              contactNumber: {
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
        schoolId: 1,
        GPId: 1,
        date: 1,
        guid: 1,
        DoB: 1,
        contactNumber: 1,
        gardianName: 1,
        address: 1,
        summary: 1,
        status: 1,
      },
    });

    const countQuery = _.cloneDeep(query);
    countQuery.push({
      $count: "count",
    });
    let totalCount = await appointments.aggregate(countQuery).toArray();
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
    query.push({
      $lookup: {
        from: "users",
        localField: "GPId",
        foreignField: "guid",
        as: "GP",
      },
    });
    query.push({
      $unwind: { path: "$GP", preserveNullAndEmptyArrays: true },
    });
    query.push({
      $lookup: {
        from: "users",
        localField: "schoolId",
        foreignField: "guid",
        as: "school",
      },
    });
    query.push({
      $unwind: { path: "$school", preserveNullAndEmptyArrays: true },
    });
    const result = await appointments.aggregate(query).toArray();

    return { totalCount, appointments: result };
  },

  addNewAppointment: async ({ appointment }) => {
    return appointments.insertOne(appointment);
  },

  updateAppointment: async ({ appointment }) => {
    return appointments.updateOne(
      { guid: appointment.guid },
      { $set: appointment }
    );
  },
};
