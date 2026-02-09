import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { userModel } from "../models/user.model.js";
import mongoose from "mongoose";


const generateAccessAndRefreshToken = async (userId) => {

    try {
        const user = await userModel.findById(userId)
        
        if(!user)
         console.log("user not found");
       
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false});
    
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
        
    }

        
}

const registerUser=asyncHandler(async (req,res)=>{
    //data accept karaycha 
    //data validate karayacha
    //user already exist ahe ki nhi te check karayach
    //check for images ,check for avatar
    //upload them to cloudinary

    //create user object and save in database
    //remove password and refresh token field from response
    //check for user creation 
    //return res
    //console.log("email: ", email);

    
    const {name,email,password} = req.body;

    if (
        [ email, name, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await userModel.findOne({
        $or: [{ email}]
    })

    if(existedUser)
    {
        throw new ApiError(400,"user already exists");
    }

    const user =await  userModel.create({
            name: name,
            email: email,
            password: password
    })

    // console.log(user);

    const createdUser = await userModel.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser)
    {
        throw new ApiError(500,"Something went wrong while registering the user");
    }   

    res.json(new ApiResponse(200,createdUser,"User registered successfully"));

})

const loginUser = asyncHandler(async (req,res) => {

    const {email,password} = req.body;
    if(
        [email,password].some((field)=>field?.trim()==="")
    )
    {
        throw new ApiError(400,"All fields are required");
    }
    
    const user = await userModel.findOne({email:email});

    // console.log(user)

    if(!user)
    {
        throw new ApiError(400,"User does not exist");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    // if(isPasswordCorrect)
    //     console.log("password is correct")

    if(!isPasswordCorrect)
    {
        throw new ApiError(400,"Invalid credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await userModel.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,  // HTTPS ke liye, localhost pe false rakh sakte ho
        sameSite: "none",
        maxAge: 86400000 // 1 day (ACCESS_TOKEN_EXPIRY)
    };
    
    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async (req,res) => {

   await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: null
            }
        },
        {
            new: true
        }
    );   

    const options = {
        httpOnly: true,
        secure:true
        }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out successfully")) 

})

const getCurrentUser = asyncHandler(async (req,res) => {
    return res.status(200)
    .json(new ApiResponse(200,req.user,"current user data sent successfully"));
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshAccessToken;
   
    if(!incomingRefreshToken)
    {
       throw new ApiError(401,"unauthorized request")
    }

   try {
       const decodedToken = jwt.verify(incomingRefreshToken,
           process.env.REFRESH_TOKEN_SECRET
       );
   
       const user = await userModel.findById(decodedToken?._id)
   
       if(!user)
       {
           throw new ApiError(401,"Invalid Refresh Token");
       }
   
       if(incomingRefreshToken !== user?.refreshToken)
       {
           throw new ApiError(401,"Refresh token is expired or used")
       }
   
       const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 864000000 // 10 days (REFRESH_TOKEN_EXPIRY)
    };
       const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id);
   
       return res.status(200)
       .cookie("accessToken",accessToken)
       .cookie("refreshToken",newRefreshToken)
       .json(new ApiResponse(200,{accessToken,refreshToken:newRefreshToken},
           "Access Token Refreshed"
       ))
   } catch (error) {
       throw new ApiError(401,error?.message || "Invalid RefreshToken")
   }
})

export {
    registerUser,
    loginUser ,
    logoutUser,
    refreshAccessToken,
    getCurrentUser
}