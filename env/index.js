const createConfig = () => {
  const isProduction = process.env.NODE_ENV === "production";
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const config = require(isProduction ? "./production" : "./development");
  const exportedConfig = {};
  let local = {};

  if (!isProduction) {
    try {
      // eslint-disable-next-line global-require
      local = require("./local");
    } catch (ex) {
      // no-op
    }
  }

  const exportProps = (obj, override, target) => {
    const source = obj.value || obj;
    const keys = Object.keys(source);

    keys.forEach((propKey) => {
      const prop = override[propKey] || source[propKey];

      if (prop) {
        if (prop.type === Array) {
          target[propKey] = JSON.parse(prop.value.replace(/'/gi, '"'));
        } else if (prop.type === Number) {
          target[propKey] = Number(prop.value);
        } else if (prop.type === Boolean) {
          if (_.isBoolean(prop.value)) {
            target[propKey] = prop.value;
          } else {
            target[propKey] =
              (prop.value &&
                prop.value.toLowerCase &&
                prop.value.toLowerCase()) === "true";
          }
        } else if (prop.type === String) {
          target[propKey] =
            prop.value || (_.isString(prop.value) ? prop.value : undefined);
        } else if (_.isObject(prop)) {
          // is JSON
          target[propKey] = target[propKey] || {};
          override[propKey] = override[propKey] || {};

          exportProps(prop, override[propKey], target[propKey]);
        } else {
          // string
          target[propKey] = prop.value || (_.isString(prop) ? prop : undefined);
        }
      }
    });
  };

  exportProps(config, local, exportedConfig);

  exportedConfig.isProduction = isProduction;
  exportedConfig.isDevelopment = !isProduction;

  return exportedConfig;
};

module.exports = createConfig();
