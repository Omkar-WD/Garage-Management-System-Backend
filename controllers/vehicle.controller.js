const CONSTS = require("../helper/consts");
const Vehicle = require("../modals/vehicle.modal");
const commonController = require("./common.controller");

// Get Vehicle from vehicle number
const getSingleVehicleFromVehicleNumber = (Modal, callback) => async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne(
            { number: req.params.vehicleNumber },
            "_id number numberDetails brand type model customerName customerMobile customerAddress jobs quotations"
        )
            .populate({ path: 'brand', select: 'name' })
            .populate({ path: 'type', select: 'type' })
            .populate({ path: 'model', select: 'name' })
            .populate({ path: 'jobs', select: '' })
            .populate({ path: 'quotations', select: '' })
            .lean()
            .exec();
        if (!vehicle) throw { message: "Vehicle not exists!" };
        return res.status(CONSTS.STATUS.OK).send({ success: true, data: vehicle });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
}

module.exports = {
    createVehicle: commonController.create(Vehicle, (req, res) => ({ number: req.body.number })),
    getAllVehicles: commonController.getAll(Vehicle, (req, res) => (
        {
            dataTobeRetrieved: "_id number numberDetails brand type model customerName customerMobile customerAddress jobs quotations",
            populate1: { path: 'brand', select: 'name' },
            populate2: { path: 'type', select: 'type' },
            populate3: { path: 'model', select: 'name' },
            populate4: { path: 'jobs', select: '' },
            populate5: { path: 'quotations', select: '' }
        })
    ),
    getSingleVehicle: commonController.getSingle(Vehicle, (req, res) => (
        {
            query: { _id: req.params.vehicleId },
            dataTobeRetrieved: "_id number numberDetails brand type model customerName customerMobile customerAddress jobs quotations",
            populate1: { path: 'brand', select: 'name' },
            populate2: { path: 'type', select: 'type' },
            populate3: { path: 'model', select: 'name' },
            populate4: { path: 'jobs', select: '' },
            populate5: { path: 'quotations', select: '' }
        })
    ),
    getSingleVehicleFromVehicleNumber: getSingleVehicleFromVehicleNumber(),
    editVehicle: commonController.edit(Vehicle, (req, res) => ({ _id: req.params.vehicleId })),
    deleteVehicle: commonController.deleteSingle(Vehicle, (req, res) => ({ _id: req.params.vehicleId })),
    notFound: commonController.notFound()
};