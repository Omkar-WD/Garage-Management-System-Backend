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
        vehicleType: { type: mongoose.Schema.Types.ObjectId, ref: 'Type', required: true },
        vehicleBrand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
        vehicleModel: { type: mongoose.Schema.Types.ObjectId, ref: 'Model', required: true },
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