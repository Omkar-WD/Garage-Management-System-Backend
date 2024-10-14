const express = require("express");
const router = express.Router();
const { validationResult, Result, check } = require("express-validator");
const Vehicle = require("../models/vehicle.model");
const CONSTS = require("../helper/consts");

//Create Vehicle
router.post(
    "/create",
    [],
    async (req, res) => {
        try {
            // error handling
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(CONSTS.STATUS.BAD_REQUEST).json({
                    success: false,
                    message: errors.array()[0].msg,
                });
            }

            let vehicle = await Vehicle.findOne({ vehicleNumber: req.body.vehicleNumber })
                .lean()
                .exec();

            if (vehicle) {
                return res
                    .status(CONSTS.STATUS.BAD_REQUEST)
                    .send({ success: false, message: "Vehicle already exist" });
            }
            vehicle = await Vehicle.create(req.body);
            vehicle = await Vehicle.findById(vehicle._id).populate({
                path: 'jobs',
                populate: { path: 'vehicleNumber' }
            }).populate({
                path: 'quotations',
                populate: { path: 'job' }
            });

            return res.status(CONSTS.STATUS.CREATED).send({
                success: true,
                vehicle,
            });
        } catch (error) {
            return res
                .status(CONSTS.STATUS.BAD_REQUEST)
                .send({ success: false, message: error.message });
        }
    }
);

//Get Vehicles List
router.get("/all-vehicles", async (req, res) => {
    try {
        const vehicles = await Vehicle.find(
            {}
        )
            .populate({
                path: 'jobs',
                populate: { path: 'vehicleNumber' }
            }).populate({
                path: 'quotations',
                populate: { path: 'job' }
            })
            .lean()
            .exec();
        return res.status(CONSTS.STATUS.OK).send({ success: true, vehicles });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

//Get Vehicle
router.get("/:vehicleId", async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(
            { _id: req.params.vehicleId }
        )
            .populate({
                path: 'jobs',
                populate: { path: 'vehicleNumber' }
            }).populate({
                path: 'quotations',
                populate: { path: 'job' }
            })
            .lean()
            .exec();
        if (!vehicle) throw { message: "Vehicle not exists!" };
        return res.status(CONSTS.STATUS.OK).send({ success: true, vehicle });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

// Delete Vehicle
router.delete("/delete/:vehicleId", async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(CONSTS.STATUS.BAD_REQUEST).send({
                success: false,
                message: "Only admin user can perform delete operation!",
            });
        }
        await Vehicle.findByIdAndDelete({ _id: req.params.vehicleId });
        res
            .status(CONSTS.STATUS.OK)
            .send({ success: true, message: "vehicle deleted!" });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

// Edit Vehicle
router.patch("/edit/:vehicleId", async (req, res) => {
    Vehicle.findByIdAndUpdate({ _id: req.params.vehicleId }, req.body, { new: true, runValidators: true })
        .then(updatedVehicle => {
            if (!updatedVehicle) {
                return res.status(CONSTS.STATUS.BAD_REQUEST).send('Vehicle not found');
            }
            res
                .status(CONSTS.STATUS.OK)
                .send({ success: true, message: "vehicle details updated!", vehicle: updatedVehicle });
        })
        .catch(error => {
            return res
                .status(CONSTS.STATUS.BAD_REQUEST)
                .send({ success: false, message: error.message });
        });

});

module.exports = router;