const roles = {
  Admin: "admin",
  User: "user",
};

module.exports = {
  statics: {
    roles,
  },
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "firstName",
        "lastName",
        "mobile",
        "email",
        "guid",
        "roles",
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
        guid: {
          bsonType: "string",
        },
        roles: {
          bsonType: "array",
          items: {
            bsonType: "string",
            enum: Object.values(roles),
          },
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
        verification: {
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
        failedLogin: {
          bsonType: "object",
          properties: {
            count: {
              bsonType: "int",
            },
            lastTry: {
              bsonType: "date",
            },
          },
        },
      },
    },
  },
};
