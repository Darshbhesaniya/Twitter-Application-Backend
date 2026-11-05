import multer from 'multer';

// Use memoryStorage so multer holds the file in RAM (buffer) instead of writing
// to a local "uploads/" folder. This is required for cloud deployments (Render,
// Railway, etc.) where the local filesystem is ephemeral and "uploads/" may not
// exist. The buffer is passed directly to Cloudinary — no disk write needed.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default upload;
