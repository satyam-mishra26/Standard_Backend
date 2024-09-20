import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {Topper} from "../models/topper.model.js";
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerTopper = asyncHandler(async (req , res)=>{
    const {name,standard,medium,score} = req.body

    if (
        [name,standard,medium,score].some((field)=>field?.trim()==="")
    ) {
       throw new ApiError(400,"All Fields Are Reuired") 
    }


    const existedTopper = await Topper.findOne({
        name
    })


    if(existedTopper){
        throw new ApiError(409,"Topper Already Existed")
    }


    const topperImageLocalPath=req.files?.topperImage[0]?.path;
    

    if(!topperImageLocalPath){
        throw new ApiError(400,"Topper Image Is Required")
    }

    const topperImage = await uploadOnCloudinary(topperImageLocalPath);

    if(!topperImage){
        throw new ApiError(400,"Topper Image Is Required")
    }

    const topper = await Topper.create({
        name,
        standard,
        medium,
        topperImage: topperImage.url,
        score,
    })

    const createdTopper=await Topper.findById(topper._id)
    if(!createdTopper){
        throw new ApiError(500,"Something Went Wrong While Registering The Topper")
    }

    return res.status(200).json(
        new ApiResponse(200,createdTopper,"Topper Registered Successfully")
    )

})

// Route for getting all toppers
const getAllToppers = asyncHandler(async (req, res) => {
    const toppers = await Topper.find({});

    if (!toppers || toppers.length === 0) {
        throw new ApiError(404, "No toppers found");
    }

    return res.status(200).json(new ApiResponse(200, toppers, "Toppers retrieved successfully"));
});

// Route for editing a topper element
const updateTopper = asyncHandler(async (req, res) => {
    const {name,standard,medium,score} = req.body;
    if(!name || !standard || !medium || !score){
        throw new ApiError(400,"Please Provide All Details")
    }

    const topper = await Topper.findByIdAndUpdate(
        req.params.id,
        {
            $set:{
                name,standard,medium,score
            }
        },
        {new:true}
    )
    console.log(topper)

    return res
    .status(200)
    .json(new ApiResponse(200,"Topper Updated Successfully !!!",topper))

});

const updateTopperImage = asyncHandler (async(req,res)=>{
    const topperImageLocalPath = req.file?.path;
    if(!topperImageLocalPath){
        throw new ApiError(400,"Please Provide Avatar")
    }
    const topperImage= await uploadOnCloudinary(topperImageLocalPath);

    if(!topperImage.url){
        throw new ApiError(400,"Avatar Upload Failed")
    }

    await Topper.findByIdAndUpdate(
        req.params.id,
        {
            $set:{
                topperImage:topperImage.url
            }
        },
        {new:true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200,"Topper Updated Successfully !!!",topperImage))

})

// Route for deleting a topper element
const deleteTopper = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Ensure a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Topper ID");
    }

    // Find and delete the topper
    const deletedTopper = await Topper.findByIdAndDelete(id);

    if (!deletedTopper) {
        throw new ApiError(404, "Topper not found");
    }

    return res.status(200).json(new ApiResponse(200, null, "Topper deleted successfully"));
});




export {registerTopper,getAllToppers,updateTopper,deleteTopper,updateTopperImage};