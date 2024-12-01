const mongoose = require("mongoose");
const Vehicle = require("./vehicle.modal");

const jobSchema = new mongoose.Schema(
    {
        vehicleNumber: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
        issues: { type: [String], required: true },
        advancePay: { type: Number, default: 0 },
        odometer: { type: Number, required: true },
        estimatedDelivery: { type: String, required: true },
        vehicleReceivedFrom: { type: String },
        vehicleCollectedBy: { type: String },
        remarks: { type: String },
        status: { type: String, default: "pending" }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

// Hook to update the Vehicle's jobs array when a Job is created
jobSchema.post('save', function (doc) {
    if (doc.vehicleNumber) {
        Vehicle.findByIdAndUpdate(
            doc.vehicleNumber,
            { $addToSet: { jobs: doc._id } }, // Add job ID to the jobs array
            { new: true }
        ).exec();
    }
});

// Hook to remove job ID from Vehicle's jobs array when a Job is deleted
jobSchema.post('findOneAndDelete', function (doc) {
    if (doc.vehicleNumber) {
        Vehicle.findByIdAndUpdate(
            doc.vehicleNumber,
            { $pull: { jobs: doc._id } }, // Remove job ID from the jobs array
            { new: true }
        ).exec();
    }
});

// Hook to empty the all Jobs from Vehicle's job array when a all the jobs are deleted
jobSchema.post('deleteMany', async function (doc) {
    await Vehicle.updateMany(
        {}, // Empty query: this will affect all Vehicle records
        { $set: { jobs: [] } } // Empty the jobs array
    );
});

module.exports = mongoose.model("Job", jobSchema);