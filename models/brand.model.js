const mongoose = require("mongoose");
// const Vehicle = require("./vehicle.model");

const brandSchema = new mongoose.Schema(
    {
        brandName: { type: String, required: true },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model("Brand", brandSchema);