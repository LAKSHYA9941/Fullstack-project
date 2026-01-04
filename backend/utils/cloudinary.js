import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config(); // ✅ This loads the .env variables into process.env


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, 
});
const UploadOnCloudinary = (async function (localpath) {
    try {
        if (!localpath || !fs.existsSync(localpath)) {
            throw new Error('Local file path is invalid or file does not exist');
        }
        const result = await cloudinary.uploader.upload(localpath, {
            resource_type: 'auto',
        });
        console.log('Image uploaded successfully:', result.secure_url);  
        console.log(result) // Clean up the local file after upload
        fs.unlinkSync(localpath); // Delete the local file after upload

        return result;
    } catch (error) {
        fs.unlinkSync(localpath); // Ensure the local file is deleted even if upload fails
        console.error('Error uploading to Cloudinary:', error);
        throw error; // Rethrow the error for further handling
    }
});

export { UploadOnCloudinary }