import express from 'express';
import { getLanguages, postLanguage  } from '../controller/languageController.js';
import { addUserLanguages , getUserLanguages } from '../controller/userController.js';  
import  apiKeyAuth  from '../middleware/apiKeyAuth.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/languages', getLanguages);
router.post('/languages', postLanguage);


router.post("/user/languages", authenticateToken, addUserLanguages);
router.get("/user/languages", authenticateToken, getUserLanguages);

export default router;
