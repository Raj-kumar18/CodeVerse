import Router from "express";
import { createBook, getAllBooks, updateBook } from "../controllers/book.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.post('/create', upload.array("images", 5), verifyJwt, createBook);
router.get('/', verifyJwt, getAllBooks);
router.put('/update-book/:bookid', verifyJwt, updateBook);


export default router;