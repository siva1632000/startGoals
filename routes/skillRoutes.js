import express from 'express';
import apiKeyAuth from '../middleware/apiKeyAuth.js';
import { addSkill, getSkills  } from '../controller/skillcontroller.js';
import { addUserSkills , getUserSkills } from '../controller/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/getSkills', apiKeyAuth,getSkills);
router.post('/postSkills', apiKeyAuth,addSkill);

router.post('/user/add-skills', authenticateToken, addUserSkills);
router.get('/get-skills', authenticateToken, getUserSkills);


export default router;
