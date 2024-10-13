const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
    {
        vehicleNumber: { type: String, required: true, unique: true },
        vehicleNumberDetails: {
            stateCode: { type: String, required: true },
            districtCode: { type: String, required: true },
            alphaNumber: { type: String, required: true },
            numericNumber: { type: String, required: true },
        },
        customerName: { type: String, required: true },
        vehicleBrand: { type: String, required: true },
        vehicleModel: { type: String, required: true },
        customerNumber: { type: String, required: true },
        customerAddress: { type: String, required: true },
        jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
        quotations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' }],
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);