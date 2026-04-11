import multer from "multer";
import path from "path";

// Storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    // Use category name if available, else fallback to timestamp
    const name = req.body.name
      ? req.body.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : Date.now().toString();
    cb(null, `${name}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files allowed!"), false);
  }
}

const upload = multer({ storage, fileFilter });

export default upload;
