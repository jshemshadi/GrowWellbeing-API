const statusType = {
  Pending: "pending",
  Assigned: "assigned",
  Completed: "completed",
  Canceled: "canceled",
};

module.exports = {
  statics: { statusType },
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "schoolId",
        "date",
        "guid",
        "DoB",
        "contactNumber",
        "gardianName",
        "address",
        "status",
      ],
      properties: {
        createdAt: {
          bsonType: "date",
        },
        updatedAt: {
          bsonType: "date",
        },
        schoolId: {
          bsonType: "string",
        },
        GPId: {
          bsonType: "string",
        },
        date: {
          bsonType: "date",
        },
        guid: {
          bsonType: "string",
        },
        DoB: {
          bsonType: "date",
        },
        contactNumber: {
          bsonType: "string",
        },
        gardianName: {
          bsonType: "string",
        },
        address: {
          bsonType: "string",
        },
        summary: {
          bsonType: "string",
        },
        status: {
          bsonType: "string",
          enum: Object.values(statusType),
        },
      },
    },
  },
};
