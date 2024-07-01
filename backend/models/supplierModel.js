import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    item:{
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
        default: 'Pending'
    },

} , {
    timestamps: true
});


const Supplier = mongoose.model("Suppliers",supplierSchema);

export default Supplier;