const express = require("express");
const cors = require("cors");
const app = express();
const connect = require("./configs/database");
const routes = require("./routes");
require("dotenv").config({ path: ".env" });
const PORT = process.env.PORT || 2345;

app.use(express.json());
app.use(cors());
app.use("/", routes);

app.listen(PORT, async () => {
  try {
    await connect();
    console.log("Listen at port", PORT);
  } catch (error) {
    console.log("Received error while connecting to mongodb", error);
  }
});
