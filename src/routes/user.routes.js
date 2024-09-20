import {Router} from "express"
import { loginUser, logOutUser, refreshAccessToken, registerUser,updateAvatar,updateUser,getCurrentUser,changePassword } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/register").post(
    upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]),
    registerUser
);

router.route("/login").post(loginUser);


//Secured Routes

router.route("/logout").post(verifyJwt, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, changePassword)
router.route("/current-user").get(verifyJwt, getCurrentUser)
router.route("/update-account").patch(verifyJwt, updateUser)

router.route("/avatar").patch(verifyJwt, upload.single("avatar"), updateAvatar)



export default router;