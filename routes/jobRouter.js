import { Router } from "express";
import { getAllJobs, createJob, getSingleJob, editJob, deleteJob, showStats  } from "../controllers/jobController.js";
import { validateIdParam, validateJobInput } from "../middleware/validationMiddleware.js";
import { checkForTestUser } from "../middleware/authMiddleware.js";

const router = Router()

// router.get('/', getAllJobs);
// router.post('/', createJob);

router.route('/').get(getAllJobs).post(checkForTestUser,validateJobInput,createJob);
router.route("/stats").get(showStats)
router.route('/:id').get(validateIdParam,getSingleJob).patch(checkForTestUser,validateJobInput,validateIdParam,editJob).delete(checkForTestUser,validateIdParam,deleteJob);

export default router