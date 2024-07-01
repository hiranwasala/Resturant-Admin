import Supplier from "../models/supplierModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await Supplier.find({});
    res.json(suppliers);
});

const createSupplier = asyncHandler(async (req, res) => {
    console.log('Request Body:', req.body); 

    const { name, item, phone, status } = req.body;

    const supplier = new Supplier({
        name,
        item,
        phone,
        status: status || 'Pending'  
    });

    const createdSupplier = await supplier.save();
    res.status(201).json(createdSupplier);
});


const deleteSupplier = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
    }
    
    await Supplier.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Supplier removed" });
});

const updateSupplier = asyncHandler(async(req,res)=> {
    const supplier = await Supplier.findById(req.params.id);
    if(!supplier){
        return res.status(404).json({ message: "Supplier not found" });
    }
    const { name, item, phone, status } = req.body;
    supplier.name = name;
    supplier.item = item;
    supplier.phone = phone;
    supplier.status = status;
    const updatedSupplier = await supplier.save();
    res.status(200).json(updatedSupplier);
})


export  {getSuppliers, deleteSupplier, createSupplier, updateSupplier};