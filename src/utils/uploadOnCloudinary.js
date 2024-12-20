import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localeFilePath) => {
  try {
    if(!localeFilePath) return null // localepath not valid then return with null
    const response = await cloudinary.uploader.upload(localeFilePath , {          // upload the file to clodinary
      resource_type : "auto"
    })
    console.log(`File has been uploaded successfully ${response}`)
    fs.unlinkSync(localeFilePath)
    return response
  } catch (error) {
    fs.unlinkSync(localeFilePath); // remove file from loacalefile system when not uploaded for cleaning purpose
    return null
  }
}

export {uploadOnCloudinary}