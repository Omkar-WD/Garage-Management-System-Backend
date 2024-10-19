const express = require("express");
const router = express.Router();

const isValidUser = require("./middlewares/auth");
const logger = require("./middlewares/logger");
const { setModalNameAsUser } = require("./middlewares/user.middleware");
const { setModalNameAsBrand } = require("./middlewares/brand.middleware");
const { setModalNameAsType } = require("./middlewares/type.middleware");
const { setModalNameAsModel } = require("./middlewares/model.middleware");
const { setModalNameAsVehicle } = require("./middlewares/vehicle.middleware");
const { setModalNameAsJob } = require("./middlewares/job.middleware");
const { setModalNameAsQuotation } = require("./middlewares/quotation.middleware");

const userRouter = require("./routes/user.route");
const brandRouter = require("./routes/brand.route");
const typeRouter = require("./routes/type.route");
const modelRouter = require("./routes/model.route");
const vehicleRouter = require("./routes/vehicle.route");
const jobRouter = require("./routes/job.route");
const quotationRouter = require("./routes/quotation.route");
const notFoundRouter = require("./routes/notFound.route");

router.use(isValidUser, logger);
router.use("/user", setModalNameAsUser, userRouter);
router.use("/brand", setModalNameAsBrand, brandRouter);
router.use("/type", setModalNameAsType, typeRouter);
router.use("/model", setModalNameAsModel, modelRouter);
router.use("/vehicle", setModalNameAsVehicle, vehicleRouter);
router.use("/job", setModalNameAsJob, jobRouter);
router.use("/quotation", setModalNameAsQuotation, quotationRouter);
router.use("/*", notFoundRouter);

module.exports = router;