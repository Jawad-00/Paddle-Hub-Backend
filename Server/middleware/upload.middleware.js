const multer = require('multer');

// store file in memory for direct upload to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
