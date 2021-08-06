const fs = require("fs");
const path = require("path");
const multer = require("multer");

const maxFileSize = process.env.MAX_FILE_SIZE;
const uploadFile = multer({
  dest: path.join("uploads", "avatar"),
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

const fileHandler = (req, res) => {
  const fileExist = fs.existsSync(path.join(__dirname, req.originalUrl));
  if (fileExist) {
    res.sendFile(req.originalUrl, { root: __dirname });
  } else {
    res.sendFile(path.join("uploads", "default", "DefaultImage.jpg"), {
      root: __dirname,
    });
  }
};

const handleInputFiles = async (req) => {
  req.body.avatar = "";
  if (req.files && req.files["avatar"]) {
    for (const avatar of req.files["avatar"]) {
      const filePath = utils.addExtensionToUploadedFile(avatar);
      req.body.avatar = filePath;
    }
  }
};

module.exports = (app) => {
  app.get(
    ["/uploads/avatar/:fileName", "/uploads/default/:fileName"],
    (req, res) => {
      fileHandler(req, res);
    }
  );

  app.patch(
    ["/users/profile", `/users/:userGUID/profile`],
    uploadFile.fields([{ name: "avatar", maxCount: 1 }]),
    async (req, res, next) => {
      await handleInputFiles(req);
      next();
    }
  );
};
