import Router from 'express';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/category.controller.js';
import { verifyJwt } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create', verifyJwt, createCategory);
router.get('/', verifyJwt, getAllCategories);
router.put('/update-category/:categoryid', verifyJwt, updateCategory);
router.delete('/delete-category/:deletecategoryid', verifyJwt, deleteCategory);

export default router;