import express from "express"
import { getInventories,
    createInventory,
    deleteInventory,
    updateInventories,} from "../controllers/inventoryController.js";
const router = express.Router();

router.route('/').get(getInventories).post(createInventory);

router.route('/:id')
    .delete(deleteInventory);

router.route('/:id')
    .put(updateInventories);

export default router;