const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure directories exist
const resumeDir = "uploads/resumes";
const answerFilesDir = "uploads/answers";

if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}
if (!fs.existsSync(answerFilesDir)) {
  fs.mkdirSync(answerFilesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "resume_file") {
      cb(null, resumeDir);
    } else {
      cb(null, answerFilesDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
