import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
   
    itemName:{
        type: String,
        required: true
    },
    itemGroup:{
        type: String,
        required: true
    },
    inStock:{
        type: Number,
        required: true
    },
    costPerUnit:{
        type: Number,
        required: true
    },
    storageLocation:{
        type: String,
        required: true
    }

} , {
    timestamps: true
});


const Inventory = mongoose.model("Inventory",inventorySchema);

export default Inventory;