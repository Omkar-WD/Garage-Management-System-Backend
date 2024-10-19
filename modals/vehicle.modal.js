const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
    {
        number: { type: String, required: true, unique: true },
        numberDetails: {
            stateCode: { type: String, required: true },
            districtCode: { type: String, required: true },
            alphaNumber: { type: String, required: true },
            numericNumber: { type: String, required: true },
        },
        customerName: { type: String, required: true },
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type', required: true },
        brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
        model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model', required: true },
        customerMobile: { type: String, required: true },
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