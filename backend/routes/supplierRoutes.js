import express from "express"
import {getSuppliers,deleteSupplier, createSupplier, updateSupplier} from "../controllers/supplierController.js";
const router = express.Router();

router.route('/').get(getSuppliers).post(createSupplier);


router.route('/:id')
    .delete(deleteSupplier).put(updateSupplier); 

export default router;