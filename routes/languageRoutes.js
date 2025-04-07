import express from 'express';
import { getLanguages, postLanguage } from '../controller/languageController.js';
import  apiKeyAuth  from '../middleware/apiKeyAuth.js';

const router = express.Router();

router.get('/languages', apiKeyAuth, getLanguages);
router.post('/languages', apiKeyAuth, postLanguage);

export default router;
