const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
    {
        name: { type: String },
        mobile: { type: Number, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        gst: { type: String, required: true, unique: true },
        inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }]
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model("Supplier", supplierSchema);