import {v2 as cloudinary} from "cloudinary";
async function removeFromCloudinary(url){
    try {
        if(!url){
            return false;
        }else{
            const publicId = url.split("/").pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId,{
                resource_type : "image",
            });
            return true;
        }    
    } catch (error) {
        return false;
    }
}

export {removeFromCloudinary};