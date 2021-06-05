const roles = {
  Admin: "admin",
  School: "school",
  GP: "gp",
  Staff: "staff",
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
        "role",
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
        role: {
          bsonType: "string",
          enum: Object.values(roles),
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
            verification: {
              bsonType: "object",
              properties: {
                code: {
                  bsonType: "string",
                },
                expiredAt: {
                  bsonType: "date",
                },
                count: {
                  bsonType: "int",
                },
                lastTry: {
                  bsonType: "date",
                },
              },
            },
            passwordReset: {
              bsonType: "object",
              properties: {
                code: {
                  bsonType: "string",
                },
                expiredAt: {
                  bsonType: "date",
                },
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
