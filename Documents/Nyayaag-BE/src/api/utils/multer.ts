import multer from "multer";
import path from "path";
import crypto from "crypto";

const createHash = (str: string) => {
    const hash = crypto.createHash("sha256").update(str).digest("hex");
    return hash;
};

const storage = multer.diskStorage({
    destination: "public/documents",
    filename: (_req, file, callback) => {
        callback(null, createHash(String(file.fieldname + Date.now())) + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5000000,
    },
    fileFilter: (_req, file, callback) => {
        validateFile(file, callback);
    },
});

const validateFile = (file:any, callback:any) => {
    const allowedFileType = /pdf/;
    const extension = allowedFileType.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileType.test(file.mimetype);
    if (extension && mimeType) {
        return callback(null, true);
    } else {
        callback("Invalid file type. Only PDF files are allowed.");
    }
};

export { upload, createHash };
