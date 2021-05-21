module.exports = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "firstName",
        "lastName",
        "mobile",
        "email",
        "username",
        "password",
        "status",
      ],
      properties: {
        createdAt: {
          bsonType: "date",
        },
        updatedAt: {
          bsonType: "date",
        },
        lastSeen: {
          bsonType: "date",
        },
        firstName: {
          bsonType: "string",
        },
        lastName: {
          bsonType: "string",
        },
        mobile: {
          bsonType: "string",
        },
        email: {
          bsonType: "string",
        },
        avatar: {
          bsonType: "string",
        },
        username: {
          bsonType: "string",
        },
        password: {
          bsonType: "string",
        },
        status: {
          bsonType: "object",
          properties: {
            isTrash: {
              bsonType: "bool",
            },
            isSuspend: {
              bsonType: "bool",
            },
            isActive: {
              bsonType: "bool",
            },
          },
        },
        token: {
          bsonType: "object",
          properties: {
            code: {
              bsonType: "string",
            },
            expiredAt: {
              bsonType: "date",
            },
          },
        },
      },
    },
  },
};
