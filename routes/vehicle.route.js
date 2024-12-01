const express = require("express");
const vehicleController = require("../controllers/vehicle.controller");

const vehicleRouter = express.Router();

vehicleRouter.post("/create", vehicleController.createVehicle);
vehicleRouter.get('/all', vehicleController.getAllVehicles);
vehicleRouter.get('/:vehicleId', vehicleController.getSingleVehicle);
vehicleRouter.get('/number/:vehicleNumber', vehicleController.getSingleVehicleFromVehicleNumber);
vehicleRouter.get('/brand/:brandId', vehicleController.getAllVehicleFromBrand);
vehicleRouter.patch("/edit/:vehicleId", vehicleController.editVehicle);
vehicleRouter.delete("/delete/:vehicleId", vehicleController.deleteVehicle);
vehicleRouter.delete("/delete-all", vehicleController.deleteAllVehicles);
vehicleRouter.all("/*", vehicleController.notFound);

module.exports = vehicleRouter;