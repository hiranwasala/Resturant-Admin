import mongoose from "mongoose";
import dotenv from "dotenv";
import suppliers from "./data/SupplierDetails.js";
import Supplier from "./models/supplierModel.js";
import Employee from "./models/employeeModel.js";
import intialEmployees from "./data/EmployeeIntial.js";
import connectDB from "./config/db.js";
import colors from 'colors';
import Product from "./models/productModel.js";
import products from "./data/Products.js";
import Order from "./models/orderModel.js";
import { orders } from "./data/Orders.js";
import Reservation from "./models/reservationModel.js";
import initialReservations from "./data/ReservationIntials.js";
import User from "./models/userModel.js";
import users from "./data/Users.js";
import Inventory from "./models/inventoryModel.js";
import stockItems from './data/StockItems.js'

dotenv.config();
connectDB();

const importData = async ()=> {
    try{
        // await Supplier.deleteMany();
        // await Supplier.insertMany(suppliers);
        // await Employee.deleteMany();
        // await Employee.insertMany(intialEmployees);
        // await Product.deleteMany();
        // await Product.insertMany(products);
        // await Reservation.deleteMany();
        // await Reservation.insertMany(initialReservations);
        // await User.deleteMany();
        // await User.insertMany(users);
        // await Order.deleteMany();
        // await Order.insertMany(orders);
        await Inventory.deleteMany();
        await Inventory.insertMany(stockItems);
        console.log("Data Imported".green.inverse);
        process.exit();
    }catch(error){
        console.error(error);
        process.exit(1);
    }
}

const destroyData = async ()=> {
    try{
        // await Supplier.deleteMany();
        await Product.deleteMany();
        console.log("Data Destroyed".red.inverse);
        process.exit();
}catch(error){
    console.error(error);
    process.exit(1);
}
}

if(process.argv[2] === '-d'){
    destroyData();
}else{
    importData();
}

