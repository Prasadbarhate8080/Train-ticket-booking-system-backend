import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js" 
import jwt from "jsonwebtoken"
import {userModel} from "../models/user.model.js"

export const verifyJWT=asyncHandler(async (req,res,next)=>{
    try {
        
      const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        
    
      console.log(token);
      
 
      if(!token)
      {
          throw new ApiError(401,"Unauthorized Request");
      }
      
      const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
      const user=await userModel.findById(decodedToken?._id).select("-password -refreshToken")
  
      if(!user)
      {
          throw new ApiError(401,"Invalid AccessToken")
      }
  
      req.user=user;
      next();
    } catch (error) {
     throw new ApiError(401, error?.message || "Invalid access token")
    }
 })

export const isAdmin = asyncHandler(async (req,res,next)=>{

    try {
        if(!req.user)
        {
            throw new ApiError(401,"Unauthorized Request");
        }
    
        if(req.user.role !== "admin")
        {
            throw new ApiError(403,"You are not authorized to access this resource")
        }
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})