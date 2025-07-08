import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, // Click 'View API Keys' above to copy your cloud name
    api_key: process.env.CLOUDINARY_API_KEY, // Click 'View API Keys' above to copy your API key
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});
const UploadOnCloudinary = (async function (localpath) {
    try {
        if (!localpath || !fs.existsSync(localpath)) {
            throw new Error('Local file path is invalid or file does not exist');
        }
        const result = await cloudinary.uploader.upload(localpath, {
            resource_type: 'auto',
        });
        console.log('Image uploaded successfully:', result.secure_url);   // Clean up the local file after upload
        fs.unlinkSync(localpath); // Delete the local file after upload
        return result;
    } catch (error) {
        fs.unlinkSync(localpath); // Ensure the local file is deleted even if upload fails
        console.error('Error uploading to Cloudinary:', error);
        throw error; // Rethrow the error for further handling
    }
});

export { UploadOnCloudinary }