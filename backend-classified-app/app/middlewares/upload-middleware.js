
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // create this folder if not present
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // rename file with timestamp
    }
  });
  
  export const upload = multer({ storage });