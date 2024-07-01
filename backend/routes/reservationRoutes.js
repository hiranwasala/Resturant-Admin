import express from "express";
import { getReservations, createReservation, deleteReservation, updateReservation } from "../controllers/reservationController.js";
import {protect, admin} from '../middleware/authMiddleware.js'

const router = express.Router();

router.route('/').get(getReservations).post(protect,createReservation);
router.route('/:id').delete(deleteReservation).put(updateReservation); 


export default router;
