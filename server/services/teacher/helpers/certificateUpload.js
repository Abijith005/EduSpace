import multer from "multer";
import multerS3 from "multer-s3";
import s3Config from "../config/s3BucketConfig.js";

const bucket = process.env.S3_BUCKET;

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    req.fileValidationError = 'Only PDF files are allowed';
    cb(null, false);
  }
};

const uploadPdf = multer({
  storage: multerS3({
    s3: s3Config,
    bucket: bucket,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 3 },
}).array('certificates', 3); // Allowing up to 3 files

export default uploadPdf;
