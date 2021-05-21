const fs = require("fs");
const path = require("path");
const validator = require("validator");
const axios = require("axios");

const { ObjectID } = require("mongodb");

module.exports = {
  requireDirectory: (root, result = {}) => {
    const directories = fs.readdirSync(root);

    directories.forEach((directory) => {
      if (directory !== ".DS_Store") {
        if (fs.lstatSync(path.join(root, directory)).isDirectory()) {
          result[directory] = {};
          utils.requireDirectory(path.join(root, directory), result[directory]);
        } else {
          const prop = path.parse(directory).name;
          result[prop] = require(path.join(root, directory));
        }
      }
    });

    return result;
  },
  validateType: (type, value, required) => {
    switch (type) {
      case "string":
        if (required) {
          if (!value.length) {
            return false;
          }
        } else {
          if (!value.length && value !== "") {
            return false;
          }
        }
        break;
      case "int": {
        if (!validator.isInt(value.toString())) {
          return false;
        }
        break;
      }

      case "double": {
        if (!validator.isFloat(value.toString())) {
          return false;
        }
        break;
      }

      case "bool": {
        if (!validator.isBoolean(value.toString())) {
          return false;
        }
        break;
      }

      case "objectId": {
        if (!ObjectID.isValid(value)) {
          return false;
        }
        break;
      }

      case "date": {
        if (!Date.parse(value.toString())) {
          return false;
        }
        break;
      }

      case "array": {
        if (!Array.isArray(value)) {
          return false;
        }
        break;
      }

      default:
        throw new Error("Validator not implemented!!!");
    }

    return true;
  },
  get: async (url, options) => {
    const { data } = await axios.get(url, options || {});

    return data;
  },
  post: async (url, params, options) => {
    const { data } = await axios.post(url, params || {}, options || {});

    return data;
  },
};
