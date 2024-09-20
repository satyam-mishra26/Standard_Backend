import { Router } from 'express';
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { 
    createEnquiry, 
    getAllEnquiries, 
    getEnquiryById, 
    updateEnquiry, 
    deleteEnquiry, 
    markAsEnquired
} from '../controllers/enquiry.controller.js'; 

const router = Router();

// Public Routes
router.route('/enquiries').post(createEnquiry); 
router.route('/enquiries').get(getAllEnquiries); 

router.route('/enquiries/:id')
    .get(getEnquiryById) 
    .put(updateEnquiry) 
    .delete(deleteEnquiry);

// Mark an enquiry as enquired
router.route('/enquiries/:id/mark-as-enquired').patch(markAsEnquired);


export default router;
