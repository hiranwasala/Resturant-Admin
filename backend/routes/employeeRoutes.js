import express from "express";
import { getEmployees, deleteEmployee, createEmployee, updateEmployee } from "../controllers/employeeController.js";

const router = express.Router();

router.route('/').get(getEmployees).post(createEmployee);

router.route('/:id')
    .delete(deleteEmployee);

router.route('/:id')
    .put(updateEmployee);

export default router;
