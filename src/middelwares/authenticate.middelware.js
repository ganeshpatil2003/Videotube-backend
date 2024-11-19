import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from 'json-web-token'
import {User} from '../models/User.module.js'
export const verifyJWt = asyncHandler(async (req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ","");
    
        if(!token){
            throw new ApiError(401,"Unauthorized request.");
        }
        const decodedTkoen = await jwt.verify(token,process.env.ACCESS_TOKEN_KEY);
    
        const user = await User.findById(decodedTkoen?._id).select("-password -refreshToken");
    
        if(!user){
            // discuss about front end
            throw new ApiError(401,"Invalid Access Token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token")
    }

})