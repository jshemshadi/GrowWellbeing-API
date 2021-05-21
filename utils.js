const fs = require("fs");
const path = require("path");
const validator = require("validator");
const axios = require("axios");
var CryptoJS = require("crypto-js");

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
  checkStatus: ({ req, res, result }) => {
    if (result) {
      if (result.isSuccess) {
        res.status(200);
      } else if (result.unauthorized) {
        res.status(401);
      } else {
        res.status(406);
      }
      res.send(result);
    } else {
      res.status(400).json({
        msg: "EMPTY_RESULT",
      });
    }
  },

  // AXIOS
  get: async (url, options) => {
    const { data } = await axios.get(url, options || {});

    return data;
  },
  post: async (url, params, options) => {
    const { data } = await axios.post(url, params || {}, options || {});

    return data;
  },

  // PASSWORD
  isStrongPassword: ({ password }) => {
    // (?=.*\d)        -> SHOULD CONTAIN AT LEAST ONE DIGIT (contain at least 1 number)
    // (?=.*[a-z])     -> SHOULD CONTAIN AT LEAST ONE LOWER CASE (contain at least 1 lowercase character (a-z))
    // (?=.*[A-Z])     -> SHOULD CONTAIN AT LEAST ONE UPPER CASE (contain at least 1 uppercase character (A-Z))
    // [a-zA-Z0-9]     -> SHOULD CONTAIN FROM THE MENTIONED CHARACTERS (contains only 0-9a-zA-Z)
    // {8,}            -> SHOULD CONTAIN AT LEAST 8 CHARACTERS (Contain at least 8 characters)

    const reg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}/;
    return reg.test(password);
  },
  createHashPassword: ({ password }) => {
    return CryptoJS.AES.encrypt(password, env.var.passwordKey).toString();
  },
  decryptHashPassword: ({ password }) => {
    return CryptoJS.AES.decrypt(password, env.var.passwordKey).toString(
      CryptoJS.enc.Utf8
    );
  },

  generateGUID: () => {
    return uuid.v4();
  },
};
