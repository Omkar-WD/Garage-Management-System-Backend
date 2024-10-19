const express = require("express");
const jobController = require("../controllers/job.controller");

const jobRouter = express.Router();

jobRouter.post("/create", jobController.createJob);
jobRouter.get('/all', jobController.getAllJobs);
jobRouter.get('/:jobId', jobController.getSingleJob);
jobRouter.patch("/edit/:jobId", jobController.editJob);
jobRouter.delete("/delete/:jobId", jobController.deleteJob);
jobRouter.all("/*", jobController.notFound);

module.exports = jobRouter;