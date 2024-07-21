import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAAccessAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ValidationBeforeSave:false});

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something Went Wrong While Generating Refresh And Access Tokens")
    }
}

const registerUser = asyncHandler(async (req , res)=>{
    const {userName,fullName,email,password} = req.body

    if (
        [userName,fullName,email,password].some((field)=>field?.trim()==="")
    ) {
       throw new ApiError(400,"All Fields Are Reuired") 
    }


    const existedUser = await User.findOne({
        $or:[{userName},{email}]
    })


    if(existedUser){
        throw new ApiError(409,"User Already Existed")
    }


    const avatarLocalPath=req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar Is Required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar Is Required")
    }

    const user = await User.create({
        userName,
        fullName,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something Went Wrong While Registering The User")
    }

    return res.status(200).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    )

})


const loginUser = asyncHandler( async (req , res)=>{
    const {email ,userName , password} = req.body;

    if(!email && !userName){
        throw new ApiError(400,"Email Or UserName Are Required")
    }
    const user = await User.findOne({
        $or: [{email}, {userName}]
    })

    if(!user){
        throw new ApiError(404,"Email Or UserName Are Not Registered")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(404,"Password Is Incorrect")
    }

    const {accessToken,refreshToken} = await generateAAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // cookies Sending
    const options = {
        httpOnly:true,
        secure:true
    }

    return res
           .status(200)
           .cookie("accessToken",accessToken,options)
           .cookie("refreshToken",refreshToken,options) // we can send multiple cookies
           .json(
                new ApiResponse(
                    200,
                    {
                        user:loggedInUser,accessToken,refreshToken
                    },
                    "User Logged In Successfully"
                )
           )



})


const logOutUser = asyncHandler (async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:""
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(400)
    .clearCookies("accessToken",options)
    .clearCookies("refreshToken",options)
    .json(new ApiResponse(200, {},"User Logout successfully !!!"))


})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(201,"Unauthorized Access");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    
        const user=await User.findById(decodedToken?._id);
    
        if(!user){
            throw new ApiError(401,"Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshAccessToken){
            throw new ApiError(401,"Refresh Token Is Expired or used !!!")
        }
    
        const {accessToken,newRefreshToken} = await generateAAccessAndRefreshToken(user._id);
    
    
        const options = {
            httpOnly:true,
            secure:true
        }
    
        return res
               .status(200)
               .cookie("accessToken",accessToken,options)
               .cookie("refreshToken",newRefreshToken,options) // we can send multiple cookies
               .json(
                    new ApiResponse(
                        200,
                        {accessToken,refreshToken:newRefreshToken},
                        "Access Token Refreshed"
                    )
               )
    
    } catch (error) {
        throw new ApiError(401,"Invalid Refresh Token");
        
    }
})



export {registerUser,loginUser,logOutUser,refreshAccessToken}