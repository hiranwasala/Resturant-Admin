import Inventory from "../models/inventoryModel.js";
import asyncHandler from "../middleware/asyncHandler.js";


//get inventories
const getInventories = asyncHandler(async (req, res) => {
    const inventories = await Inventory.find({});
    res.json(inventories);
});



//create inventories
const createInventory = asyncHandler(async (req, res) => {
    console.log('Request Body:', req.body); 

    const { itemName, itemGroup, inStock, costPerUnit, storageLocation } = req.body;

    const inventory = new Inventory({
        itemName, itemGroup, inStock, costPerUnit, storageLocation 
    });

    const createdInventory = await inventory.save();
    res.status(201).json(createdInventory);
   

});


//delete inventories
const deleteInventory = asyncHandler(async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);

        if (!inventory) {
            res.status(404);
            throw new Error("Inventory not found");
        }

        await Inventory.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Inventory removed" });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//update inventories
const updateInventories = asyncHandler(async (req, res) => {
    const inventory = await Inventory.findById(req.params.id);
    if(!inventory){
        return res.status(404).json({ message: "Inventory not found" });
    }
    const { itemName, itemGroup, inStock, costPerUnit, storageLocation } = req.body;
    inventory.itemName = itemName;
    inventory.itemGroup = itemGroup;
    inventory.inStock = inStock;
    inventory.costPerUnit = costPerUnit;
    inventory.storageLocation = storageLocation;
    const updatedInventory = await inventory.save();
    res.status(200).json(updatedInventory);

});

export {
    getInventories,
    createInventory,
    deleteInventory,
    updateInventories,
};


