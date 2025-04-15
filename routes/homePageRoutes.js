import { getHomePage , addBanner, addCategory } from '../controller/homepageController.js';  
import { authenticateToken } from '../middleware/authMiddleware.js';
import express from 'express';
import { getAllCourses , addCourse } from '../controller/courseController.js'; 
const router = express.Router();

router.get('/homepage', authenticateToken, getHomePage);
router.post('/homepage/addBanner', addBanner);
router.post('/homepage/addCategory', addCategory);
router.post('/homepage/addCourse', addCourse);
router.get('/homepage/getAllCourses', getAllCourses);

export default router;