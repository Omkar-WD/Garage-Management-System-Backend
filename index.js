const express = require("express");
const cors = require("cors");
const app = express();
const connect = require("./configs/database");
const isValidUser = require("./middlewares/auth");
require("dotenv").config({ path: ".env" });
const PORT = process.env.PORT || 2345;

app.use(express.json());
app.use(cors());

const userController = require("./controllers/user.controller");
const vehicleController = require("./controllers/vehicle.controller");
const jobController = require("./controllers/job.controller");
const quotationController = require("./controllers/quotation.controller");
const commonController = require("./controllers/common.controller");

app.use(isValidUser);

app.use("/user", userController);
app.use("/vehicle", vehicleController);
app.use("/job", jobController);
app.use("/quotation", quotationController);
app.use("/*", commonController);

app.listen(PORT, async () => {
  try {
    await connect();
    console.log("Listen at port", PORT);
  } catch (error) {
    console.log("Received error while connecting to mongodb", error);
  }
});
