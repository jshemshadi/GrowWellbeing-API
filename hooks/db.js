const fs = require("fs");
const path = require("path");
const pluralize = require("pluralize");
const { MongoClient } = require("mongodb");

const generateModelName = (file) => {
  const ext = path.extname(file);
  const name = path.basename(file, ext);

  const modelName = pluralize(_.camelCase(name));

  return modelName;
};

module.exports = async () => {
  try {
    let mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    let url;

    if (env.isProduction) {
      mongoOptions = {
        ...mongoOptions,
        auth: {
          user: env.database.username,
          pass: env.database.password,
        },
        authSource: env.database.authSource,
      };
      url =
        env.database.url.split("//")[0] +
        "//" +
        env.database.username +
        ":" +
        env.database.password +
        "@" +
        env.database.url.split("//")[1] +
        env.database.dbName;
    } else {
      url = env.database.url;
    }

    const client = await MongoClient.connect(`${url}`, mongoOptions);

    const database = client.db(env.database.dbName);

    const existCollections = await database.collections();

    const files = fs.readdirSync(path.resolve("./models"));

    for (const file of files) {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const model = require(path.join(path.resolve("./models"), file));
      const modelName = generateModelName(file);

      const isNew = !_.find(
        existCollections,
        (ec) => ec.collectionName === modelName
      );

      if (model.validator) {
        if (isNew) {
          await database.createCollection(modelName, {
            validator: model.validator,
          });
        } else {
          await database.command({
            collMod: modelName,
            validator: model.validator,
          });
        }
      } else if (isNew) {
        await database.createCollection(modelName);
      }

      const collection = await database.collection(modelName);

      if (model.statics) {
        Object.keys(model.statics).forEach((key) => {
          collection[key] = model.statics[key];
        });
      }

      collection.extensions = {};
      if (model.extensions) {
        Object.keys(model.extensions).forEach((key) => {
          collection.extensions[key] = model.extensions[key];
        });
      }

      database[modelName] = collection;
    }

    global.db = database;
  } catch (err) {
    console.error("Error in ORM hook", err);
  }
};
