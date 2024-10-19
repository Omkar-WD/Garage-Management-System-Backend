const mongoose = require("mongoose");
// const Vehicle = require("./vehicle.model");

const modelSchema = new mongoose.Schema(
    {
        brandName: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
        modelType: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' },
        modelName: { type: String, required: true }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model("Model", modelSchema);