import cloudinary from "../config/cloudinary.js";

// Upload a file buffer directly to Cloudinary using an upload stream.
// This replaces the previous disk-based approach (file.path → uploads/) which
// failed on cloud deployments (Render, Railway) because the "uploads/" directory
// does not exist on ephemeral filesystems.
//
// multer is now configured with memoryStorage, so file.buffer holds the bytes
// in RAM. We pipe that buffer into Cloudinary's upload_stream and resolve/reject
// based on the stream's finish/error events.
const uploadOnCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        if (!fileBuffer) {
            resolve(null);
            return;
        }

        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(fileBuffer);
    });
};

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) {
            return null;
        }

        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        throw error;
    }
};

export {
    uploadOnCloudinary,
    deleteFromCloudinary
};
