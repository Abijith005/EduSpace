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
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.fileValidationError = "Only JPEG and PNG files are allowed";
    cb(null, false);
  }
};

const uploadFiles = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fieldSize: 50 * 1024 * 1024, files: 1 },
});


export default uploadFiles