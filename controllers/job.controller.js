const Job = require("../modals/job.modal");
const commonController = require("./common.controller");

module.exports = {
    createJob: commonController.create(Job, (req, res) => ({})),
    getAllJobs: commonController.getAll(Job, (req, res) => (
        {
            dataTobeRetrieved: "_id vehicleNumber issues advancePay odometer estimatedDelivery vehicleReceivedFrom vehicleCollectedBy status remarks",
            populate1: {
                path: 'vehicleNumber',
                select: '_id number numberDetails customerName model customerMobile customerAddress',
                populate: {
                    path: 'model',
                    select: 'brand type name',
                    populate: {
                        path: 'brand',
                        select: 'name'
                    }
                }
            },
            populate2: {
                path: 'vehicleNumber',
                select: '_id number numberDetails customerName model customerMobile customerAddress',
                populate: {
                    path: 'model',
                    select: 'brand type name',
                    populate: {
                        path: 'type',
                        select: 'type'
                    }
                }
            }
        })
    ),
    getSingleJob: commonController.getSingle(Job, (req, res) => (
        {
            dataTobeRetrieved: "_id vehicleNumber issues advancePay odometer estimatedDelivery vehicleReceivedFrom vehicleCollectedBy status remarks",
            populate1: {
                path: 'vehicleNumber',
                select: '_id number numberDetails customerName model customerMobile customerAddress',
                populate: {
                    path: 'model',
                    select: 'brand type name',
                    populate: {
                        path: 'brand',
                        select: 'name'
                    }
                }
            },
            populate2: {
                path: 'vehicleNumber',
                select: '_id number numberDetails customerName model customerMobile customerAddress',
                populate: {
                    path: 'model',
                    select: 'brand type name',
                    populate: {
                        path: 'type',
                        select: 'type'
                    }
                }
            }
        })
    ),
    editJob: commonController.edit(Job, (req, res) => ({ _id: req.params.jobId })),
    deleteJob: commonController.deleteSingle(Job, (req, res) => ({ _id: req.params.jobId })),
    deleteAllJobs: commonController.deleteAll(Job),
    notFound: commonController.notFound()
};