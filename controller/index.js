const fs = require("fs");
const path = require("path");

module.exports = async (app) => {
  const routes = fs.readdirSync(__dirname);

  routes.forEach((name) => {
    const folder = path.join(__dirname, name);
    if (fs.lstatSync(folder).isDirectory()) {
      const ctrl = require(folder);

      Object.keys(ctrl).forEach((route) => {
        const { method, action } = ctrl[route];
        route = route.split("_")[1];

        if (route.length) {
          app[method](`/${name}/${route}`, action);
        } else {
          app[method](`/${name}`, action);
        }
      });
    }
  });
};
