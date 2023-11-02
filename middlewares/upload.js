const multer = require('multer');
const path = require('path');

const destination = path.resolve('temp');

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}_${Math.random() * 1E9}`;
    const fileName = `${uniquePrefix}_${file.originalname}`;
    if (file.originalname.split('.').pop() === 'exe') {
      cb(new Error("Заборонене розширення файлу"));
    } else {
      cb(null, fileName);
    }
  }
});

const limits = {
  fileSize: 5 * 1024 * 1024
};

const upload = multer({
  storage,
  limits
});

module.exports = upload;
