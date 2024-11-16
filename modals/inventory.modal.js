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
        Supplier.findByIdAndUpdate(
            doc.supplierName,
            { $addToSet: { inventory: doc._id } }, // Add Inventory ID to the inventory array
            { new: true }
        ).exec();
    }
});

// Hook to remove Inventory ID from Supplier's inventory array when a Inventory is deleted
inventorySchema.post('remove', async function (doc) {
    if (doc.supplierName) {
        Supplier.findByIdAndUpdate(
            doc.supplierName,
            { $pull: { inventory: doc._id } }, // Remove Inventory ID from the Inventory array
            { new: true }
        ).exec();
    }
});

module.exports = mongoose.model("Inventory", inventorySchema);