const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema(
    {
        vehicleType: { type: String, required: true }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model("Type", typeSchema);