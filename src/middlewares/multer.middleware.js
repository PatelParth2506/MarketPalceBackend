const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image");
  },
  filename: function (req, file, cb) {
    const uniquename = Date.now() + "-" + file.originalname;
    cb(null, uniquename);
  },
});

const upload = multer({ storage });

module.exports = upload;
