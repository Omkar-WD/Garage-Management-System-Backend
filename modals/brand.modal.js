const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model("Brand", brandSchema);