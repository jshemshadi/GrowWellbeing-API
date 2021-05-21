const fs = require("fs");
const path = require("path");
const multer = require("multer");

const maxFileSize = process.env.MAX_FILE_SIZE;
const uploadFile = multer({
  dest: path.join("uploads", "files"),
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
  req.body.file = "";
  if (req.files && req.files["file"]) {
    for (const file of req.files["file"]) {
      const filePath = utils.addExtensionToUploadedFile(file);
      req.body.file = filePath;
    }
  }
};

module.exports = (app) => {
  app.get(
    ["/uploads/files/:fileName", "/uploads/default/:fileName"],
    (req, res) => {
      fileHandler(req, res);
    }
  );

  app.patch(
    ["/users/profile", `/users/:userGUID/profile`],
    uploadFile.fields([{ name: "file", maxCount: 1 }]),
    async (req, res, next) => {
      await handleInputFiles(req);
      next();
    }
  );
};
