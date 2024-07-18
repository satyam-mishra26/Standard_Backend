import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

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



export {registerUser}