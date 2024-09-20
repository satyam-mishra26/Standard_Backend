import {Router} from "express"
import {  registerTopper,getAllToppers, updateTopper,updateTopperImage, deleteTopper } from "../controllers/topper.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()


router.route("/register").post(
    upload.fields([
    {
        name: "topperImage",
        maxCount: 1
    }
]),
    registerTopper
);

router.route("/").get(getAllToppers);

router.route("/updatetoppers/:id").put(updateTopper);

router.route("/topperImage").patch(upload.single("topperImage"), updateTopperImage)

router.route("/:id").delete(deleteTopper);



export default router;