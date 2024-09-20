import { Router } from "express";
import { 
    registerFaculty, 
    getAllFaculty, 
    updateFaculty, 
    updateFacultyImage, 
    deleteFaculty 
} from "../controllers/faculty.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Register a new faculty with image upload
router.route("/register").post(
    upload.fields([
        {
            name: "facultyImage",
            maxCount: 1
        }
    ]),
    registerFaculty
);

// Get all faculty members
router.route("/").get(getAllFaculty);

// Update faculty details
router.route("/updatefaculty/:id").put(updateFaculty);

// Update faculty image
router.route("/facultyImage/:id").patch(
    upload.single("facultyImage"),
    updateFacultyImage
);

// Delete a faculty by ID
router.route("/:id").delete(deleteFaculty);

export default router;
