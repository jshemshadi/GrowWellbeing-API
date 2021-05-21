const fs = require("fs");
const path = require("path");

const validateInput = (schema, params = {}, key, isRoot) => {
  if (schema) {
    if (isRoot || schema.type === "object") {
      let keys;
      if (isRoot) {
        keys = Object.keys(schema);
      } else {
        keys = Object.keys(schema.props);
      }

      keys.forEach((prop) => {
        let newSchema;
        if (isRoot) {
          newSchema = schema[prop];
        } else {
          newSchema = schema.props[prop];
        }

        let newParams;

        if (isRoot) {
          newParams = params;
        } else {
          newParams = params && params[key];
        }

        if (isRoot) {
          return validateInput(newSchema, newParams, prop, false);
        } else {
          if (!params && schema.required) {
            if (env.isProduction) {
              throw new Error("MISSING_REQUIRED_FIELDS");
            }
            throw new Error(`${prop}_IS_REQUIRED`);
          } else if (newParams) {
            return validateInput(newSchema, newParams, prop, false);
          }
        }
      });
    } else if (schema.type === "array") {
      const hasProp = _.find(Object.keys(params), (p) => p === key);
      const targetArray = params && params[key];

      if (
        schema.required &&
        (!hasProp || !Array.isArray(targetArray) || targetArray.length === 0)
      ) {
        if (env.isProduction) {
          throw new Error("MISSING_REQUIRED_FIELDS");
        }
        throw new Error(`${key}_IS_REQUIRED`);
      }

      if (targetArray) {
        if (!Array.isArray(targetArray)) {
          throw new Error(`EXPECTED_${schema.type}_FOR_${key}`);
        }

        targetArray.forEach((newParams) => {
          validateInput(schema.items, [newParams], 0, false);
        });
      }
    } else {
      if (schema.required && !_.find(Object.keys(params), (p) => p === key)) {
        if (env.isProduction) {
          throw new Error("MISSING_REQUIRED_FIELDS");
        }
        throw new Error(`${key}_IS_REQUIRED`);
      }

      let mustCheck;
      if (key !== 0) {
        mustCheck = _.find(Object.keys(params), (p) => p === key);
      } else {
        mustCheck = params[key];
      }

      if (mustCheck) {
        if (mustCheck !== "search") {
          if (!utils.validateType(schema.type, params[key], schema.required)) {
            throw new Error(`EXPECTED_${schema.type}_FOR_${key}`);
          }
          if (schema.enum && !schema.enum.includes(params[key])) {
            throw new Error(`NOT_VALID_${key.toUpperCase()}`);
          }
          if (
            schema.values &&
            schema.values.length &&
            !schema.values.includes(params[key])
          ) {
            throw new Error(`${key}_IS_INVALID`);
          }
        }
      }
    }
  }
};

const runner = async (action, req, parameters) => {
  try {
    if (!action.anonymouse) {
      if (!action.permissions || !action.permissions.length) {
        throw new Error("Invalid controller implementaion");
      }

      let passedPermissions = false;
      for (const permission of action.permissions) {
        const passed = await permission(req, parameters);

        if (passed) {
          passedPermissions = true;
        }
      }
      if (!passedPermissions) {
        throw new Error("Unauthorized");
      }
    }

    if (action.inputSchema) {
      var result = validateInput(action.inputSchema, parameters, null, true);
    }

    const executionResult = await action.exec(parameters, req.user);

    return {
      isSuccess: true,
      data: executionResult,
    };
  } catch (ex) {
    return {
      isSuccess: false,
      unauthorized: ex && ex.message == "Unauthorized",
      error: ex && ex.message,
    };
  }
};

module.exports = () => {
  const folders = fs.readdirSync(__dirname);

  const result = {};

  folders.forEach((folderName) => {
    if (folderName !== ".DS_Store") {
      const folder = path.join(__dirname, folderName);
      if (fs.lstatSync(folder).isDirectory()) {
        const actions = fs.readdirSync(folder);
        result[folderName] = {};

        actions.forEach((actionFile) => {
          if (actionFile !== ".DS_Store") {
            const action = require(path.join(folder, actionFile));

            action.run = (req, params) => {
              return runner(action, req, params);
            };
            const actionName = path.parse(actionFile).name;
            result[folderName][actionName] = action;
          }
        });
      }
    }
  });

  return result;
};
