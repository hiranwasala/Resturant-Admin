import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true

    },
    designation:{
        type: String,
        required: true
        
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'New'
    },

} , {
    timestamps: true
});


const Employee = mongoose.model("Employees",employeeSchema);

export default Employee;