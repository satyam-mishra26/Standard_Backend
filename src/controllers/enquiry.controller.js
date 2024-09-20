import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Enquiry } from "../models/enquiry.model.js";

// Create a new enquiry
const createEnquiry = asyncHandler(async (req, res) => {
    const { name, standard, medium, address, email, phone, message } = req.body;

    if (!name || !standard || !medium || !address || !phone || !message) {
        throw new ApiError(400, "All Fields Are Required");
    }

    const enquiry = await Enquiry.create({
        name, standard, medium, address, email, phone, message
    });

    return res.status(201).json(new ApiResponse(201, enquiry, "Enquiry Created Successfully"));
});

// Get all enquiries
const getAllEnquiries = asyncHandler(async (req, res) => {
    const enquiries = await Enquiry.find({});

    return res.status(200).json(new ApiResponse(200, enquiries, "Enquiries Retrieved Successfully"));
});

// Get a single enquiry by ID
const getEnquiryById = asyncHandler(async (req, res) => {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
        throw new ApiError(404, "Enquiry Not Found");
    }

    return res.status(200).json(new ApiResponse(200, enquiry, "Enquiry Retrieved Successfully"));
});

// Update an enquiry by ID
const updateEnquiry = asyncHandler(async (req, res) => {
    const { name, standard, medium, address, email, phone, message, enquired } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
        req.params.id,
        { name, standard, medium, address, email, phone, message, enquired },
        { new: true }
    );

    if (!enquiry) {
        throw new ApiError(404, "Enquiry Not Found");
    }

    return res.status(200).json(new ApiResponse(200, enquiry, "Enquiry Updated Successfully"));
});

// Delete an enquiry by ID
const deleteEnquiry = asyncHandler(async (req, res) => {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
        throw new ApiError(404, "Enquiry Not Found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Enquiry Deleted Successfully"));
});

// Mark an enquiry as enquired
const markAsEnquired = asyncHandler(async (req, res) => {
    const enquiry = await Enquiry.findByIdAndUpdate(
        req.params.id,
        { enquired: true },
        { new: true }
    );

    if (!enquiry) {
        throw new ApiError(404, "Enquiry Not Found");
    }

    return res.status(200).json(new ApiResponse(200, enquiry, "Enquiry Marked as Enquired Successfully"));
});

export { createEnquiry, getAllEnquiries, getEnquiryById, updateEnquiry, deleteEnquiry, markAsEnquired };
