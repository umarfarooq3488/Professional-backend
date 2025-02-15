import { v4 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.uploads(localFilePath, {
            resource_type: "auto",
        })
        console.log(response);
        console.log("File has been uploaded successfully! The given url is: ", response.secure_url);
        return response;
    } catch (error) {
        console.log("Error while uploading file on Cloudinary: ", error);
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export default uploadFileOnCloudinary;