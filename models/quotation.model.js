const mongoose = require("mongoose");
const Vehicle = require("./vehicle.model");

const quotationSchema = new mongoose.Schema(
    {
        job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        spareSelected: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, default: 1 },
                unitPrice: { type: Number, required: true },
                labourCharge: { type: Number, default: 0 }
            }
        ]
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

// Hook to update the Vehicle's quotations array when a Quotation is created
quotationSchema.post('save', function (doc) {
    if (doc.vehicleNumber) {
        Vehicle.findByIdAndUpdate(
            doc.vehicleNumber,
            { $addToSet: { quotations: doc._id } }, // Add quotation ID to the quotations array
            { new: true }
        ).exec();
    }
});

// Hook to remove quotation ID from Vehicle's quotations array when a Quotation is deleted
quotationSchema.post('remove', function (doc) {
    if (doc.vehicleNumber) {
        Vehicle.findByIdAndUpdate(
            doc.vehicleNumber,
            { $pull: { quotations: doc._id } }, // Remove quotation ID from the quotations array
            { new: true }
        ).exec();
    }
});

module.exports = mongoose.model("Quotation", quotationSchema);