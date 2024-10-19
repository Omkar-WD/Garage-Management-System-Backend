const mongoose = require("mongoose");
// const Vehicle = require("./vehicle.model");

const modelSchema = new mongoose.Schema(
    {
        brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' },
        name: { type: String, required: true }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model("Model", modelSchema);