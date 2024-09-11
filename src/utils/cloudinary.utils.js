import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
});

const uploadOncloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

 
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' });
        
        console.log("File successfully uploaded to Cloudinary:", response.url);

        fs.unlinkSync(localFilePath);

        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error.message);

       
        try {
            fs.unlinkSync(localFilePath);
        } catch (err) {
            console.error("Failed to delete local file:", err.message);
        }

    
        return null;
    }
};

export { uploadOncloudinary };
