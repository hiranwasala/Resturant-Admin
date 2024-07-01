import Employee from "../models/employeeModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getEmployees = asyncHandler(async (req, res) => {
    const employees = await Employee.find({});
    res.json(employees);
});



const createEmployee = asyncHandler(async (req, res) => {
    console.log('Request Body:', req.body); 
    
    try {
        
    const { image, name, designation, address, phone, status } = req.body;

    const employee = new Employee({
        image: image ,
        name,
        designation,
        address,
        phone,
        status: status || 'New'  
    });

    const createdEmployee = await employee.save();
    res.status(201).json(createdEmployee);
        
    } catch (error) {
        console.error('Error creating employee:', error.message);
        res.status(400).json({ message: error.message });
        
    }
});


const deleteEmployee = asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    
    try{
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        
        await Employee.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Employee removed" });
    }catch(error){
        console.error('Error deleting employee:', error.message);
        res.status(400).json({ message: error.message });
    }
});


const updateEmployee = asyncHandler(async(req, res)=> {
    const { image, name, designation, address, phone, status } = req.body;
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
    }
    employee.image = image;
    employee.name = name;
    employee.designation = designation;
    employee.address = address;
    employee.phone = phone;
    employee.status = status;
    const updatedEmployee = await employee.save();
    res.status(200).json(updatedEmployee);
})




export  {getEmployees, deleteEmployee, createEmployee, updateEmployee}