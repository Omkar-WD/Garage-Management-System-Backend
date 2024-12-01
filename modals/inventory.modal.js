const mongoose = require("mongoose");
const Supplier = require("./supplier.modal");

const inventorySchema = new mongoose.Schema(
    {
        supplierName: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
        inventories: [
            {
                name: { type: String },
                number: { type: String, required: true, unique: true },
                unitPrice: { type: Number, required: true },
                quanitity: { type: Number, default: 1 }
            }
        ]
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

// Hook to update the Inventory array when a Inventory is created
inventorySchema.post('save', async function (doc) {
    if (doc.supplierName) {
        await Supplier.findByIdAndUpdate(
            doc.supplierName,
            { $addToSet: { inventory: doc._id } }, // Add Inventory ID to the inventory array
            { new: true }
        ).exec();
    }
});

// Hook to remove Inventory ID from Supplier's inventory array when a Inventory is deleted
inventorySchema.post('findOneAndDelete', async function (doc) {
    if (doc.supplierName) {
        await Supplier.findByIdAndUpdate(
            doc.supplierName,
            { $pull: { inventory: doc._id } }, // Remove Inventory ID from the Inventory array
            { new: true }
        ).exec();
    }
});

// Hook to empty the all Inventories from Supplier's inventory array when a all the Inventories are deleted
inventorySchema.post('deleteMany', async function (doc) {
    await Supplier.updateMany(
        {}, // Empty query: this will affect all Supplier records
        { $set: { inventory: [] } } // Empty the inventory array
    );
});

module.exports = mongoose.model("Inventory", inventorySchema);