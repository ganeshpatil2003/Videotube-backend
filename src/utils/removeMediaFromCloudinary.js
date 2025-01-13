import {v2 as cloudinary} from "cloudinary";
async function removeMediaFromCloudinary(url){
    try {
        if(!url){
            return false;
        }else{
            const publicId = url.split("/").pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId,{
                resource_type : "video",
            });
            return true;
        }    
    } catch (error) {
        return false;
    }
}

export {removeMediaFromCloudinary};