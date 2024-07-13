import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/temp/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "video/mp4",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.fileValidationError = "Only PDF, JPEG, PNG, and MP4 files are allowed";
    cb(null, false);
  }
};

const uploadFiles = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024, },
}).fields([
  { name: "notes", maxCount: 3 },
  { name: "previewImage", maxCount: 1},
  { name: "previewVideo", maxCount: 1 },
  { name: "videos", maxCount: 3 },
]);

export default uploadFiles;
