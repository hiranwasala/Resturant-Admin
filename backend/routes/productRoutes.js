import express from "express";
import { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, createAdminReply } from "../controllers/productController.js";
import {protect,admin} from '../middleware/authMiddleware.js'

const router = express.Router();
router.route('/').get(getProducts).post(createProduct);
router.route('/:id').get(getProductById).delete(deleteProduct).put(updateProduct);

router.route('/:id/reviews').post(protect,createProductReview);
router.route('/:productId/reviews/:reviewId/reply').put(createAdminReply);

export default router;