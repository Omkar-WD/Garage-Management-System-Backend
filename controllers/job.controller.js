const express = require("express");
const router = express.Router();
const { validationResult, Result, check } = require("express-validator");
const Job = require("../models/job.model");
const CONSTS = require("../helper/consts");

//Create Job
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
            let job = await Job.create(req.body);
            job = await Job.findById(job._id).populate('vehicleNumber');
            return res.status(CONSTS.STATUS.CREATED).send({
                success: true,
                job
            });
        } catch (error) {
            return res
                .status(CONSTS.STATUS.BAD_REQUEST)
                .send({ success: false, message: error.message });
        }
    }
);

//Get Job List
router.get("/all-jobs", async (req, res) => {
    try {
        const jobs = await Job.find(
            {}
        )
            .populate('vehicleNumber')
            .lean()
            .exec();
        return res.status(CONSTS.STATUS.OK).send({ success: true, jobs });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

//Get Job
router.get("/:jobId", async (req, res) => {
    try {
        const job = await Job.findById(
            { _id: req.params.jobId }
        )
            .populate('vehicleNumber')
            .lean()
            .exec();
        if (!job) throw { message: "Job not exists!" };
        return res.status(CONSTS.STATUS.OK).send({ success: true, job });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

// Delete Job
router.delete("/delete/:jobId", async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(CONSTS.STATUS.BAD_REQUEST).send({
                success: false,
                message: "Only admin user can perform delete operation!",
            });
        }
        await Job.findByIdAndDelete({ _id: req.params.jobId });
        res
            .status(CONSTS.STATUS.OK)
            .send({ success: true, message: "job deleted!" });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

// Edit Job
router.patch("/edit/:jobId", async (req, res) => {
    Job.findByIdAndUpdate({ _id: req.params.jobId }, req.body, { new: true, runValidators: true })
        .then(updatedJob => {
            if (!updatedJob) {
                return res.status(CONSTS.STATUS.BAD_REQUEST).send('Job not found');
            }
            res
                .status(CONSTS.STATUS.OK)
                .send({ success: true, message: "job details updated!", job: updatedJob });
        })
        .catch(error => {
            return res
                .status(CONSTS.STATUS.BAD_REQUEST)
                .send({ success: false, message: error.message });
        });

});

module.exports = router;