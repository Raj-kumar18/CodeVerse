import fs from "fs";
import multer from "multer";
import path from "path";

// Ensure the directory exists
const tempDir = path.join(process.cwd(), "public", "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir); // ✅ Ensure directory exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // ✅ Prevent filename conflicts
  },
});

export const upload = multer({ storage });
