import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {Faculty} from "../models/faculty.model.js";
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerFaculty = asyncHandler(async (req , res)=>{
    const {name,designation,bio,joining_date} = req.body

    if (
        [name,designation,bio,joining_date].some((field)=>field?.trim()==="")
    ) {
       throw new ApiError(400,"All Fields Are Reuired") 
    }


    const existedFaculty = await Faculty.findOne({
        name
    })


    if(existedFaculty){
        throw new ApiError(409,"Faculty Already Existed")
    }


    const facultyImageLocalPath=req.files?.facultyImage[0]?.path;
    

    if(!facultyImageLocalPath){
        throw new ApiError(400,"Faculty Image Is Required")
    }

    const facultyImage = await uploadOnCloudinary(facultyImageLocalPath);

    if(!facultyImage){
        throw new ApiError(400,"Faculty Image Is Required")
    }

    const faculty = await Faculty.create({
        name,
        designation,
        bio,
        facultyImage: facultyImage.url,
        joining_date,
    })

    const createdFaculty=await Topper.findById(faculty._id)
    if(!createdFaculty){
        throw new ApiError(500,"Something Went Wrong While Registering The FAculty")
    }

    return res.status(200).json(
        new ApiResponse(200,createdTopper,"Faculty Registered Successfully")
    )

})


const getAllFaculty = asyncHandler(async (req, res) => {
    const faculty = await Faculty.find({});

    if (!faculty || faculty.length === 0) {
        throw new ApiError(404, "No Faculty found");
    }

    return res.status(200).json(new ApiResponse(200, faculty, "Faculty retrieved successfully"));
});


const updateFaculty = asyncHandler(async (req, res) => {
    const {name,designation,bio,joining_date} = req.body;
    if(!name || !designation || !bio || !joining_date){
        throw new ApiError(400,"Please Provide All Details")
    }

    const faculty = await Faculty.findByIdAndUpdate(
        req.params.id,
        {
            $set:{
                name,designation,bio,joining_date
            }
        },
        {new:true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200,"Faculty Updated Successfully !!!",faculty))

});

const updateFacultyImage = asyncHandler (async(req,res)=>{
    const facultyImageLocalPath = req.file?.path;
    if(!facultyImageLocalPath){
        throw new ApiError(400,"Please Provide Image")
    }
    const facultyImage= await uploadOnCloudinary(facultyImageLocalPath);

    if(!facultyImage.url){
        throw new ApiError(400,"Avatar Upload Failed")
    }

    await Faculty.findByIdAndUpdate(
        req.params.id,
        {
            $set:{
                facultyImage:facultyImage.url
            }
        },
        {new:true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200,"Faculty Updated Successfully !!!",facultyImage))

})


const deleteFaculty = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Ensure a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Faculty ID");
    }

    // Find and delete the topper
    const deletedFaculty = await Faculty.findByIdAndDelete(id);

    if (!deletedFaculty) {
        throw new ApiError(404, "Faculty not found");
    }

    return res.status(200).json(new ApiResponse(200, null, "Faculty deleted successfully"));
});




export {registerFaculty,getAllFaculty,updateFaculty,deleteFaculty,updateFacultyImage};