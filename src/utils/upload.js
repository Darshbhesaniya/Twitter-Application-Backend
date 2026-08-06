import cloudinary from "../config/cloudinary.js";
import fs from 'fs';

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return response;
    } catch (error) {
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        throw error;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {

        if(!publicId){
            return null;
        }

        const response = await cloudinary.uploader.destroy(publicId);
        return response;

    } catch (error) {
        throw error;
    }
};

export { 
    uploadOnCloudinary ,
    deleteFromCloudinary
};