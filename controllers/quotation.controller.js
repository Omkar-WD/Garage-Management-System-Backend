const Quotation = require("../modals/quotation.modal");
const commonController = require("./common.controller");

module.exports = {
    createQuotation: commonController.create(Quotation, (req, res) => ({ job: req.body.job })),
    getAllQuotations: commonController.getAll(Quotation, () => (
        {
            dataTobeRetrieved: "_id job spareParts",
            populate1: {
                path: 'job',
                select: '_id vehicleNumber issues advancePay odometer estimatedDelivery vehicleReceivedFrom vehicleReceivedFrom vehicleCollectedBy status',
                populate: {
                    path: 'vehicleNumber',
                    select: '_id number numberDetails model customerName customerMobile customerAddress',
                    populate: {
                        path: 'model',
                        select: "brand type name",
                        populate: {
                            path: "brand",
                            select: "name"
                        }
                    }
                }
            },
            populate2: {
                path: 'job',
                select: '_id vehicleNumber issues advancePay odometer estimatedDelivery vehicleReceivedFrom vehicleReceivedFrom vehicleCollectedBy status',
                populate: {
                    path: 'vehicleNumber',
                    select: '_id number numberDetails model customerName customerMobile customerAddress',
                    populate: {
                        path: 'model',
                        select: "brand type name",
                        populate: {
                            path: "type",
                            select: "type"
                        }
                    }
                }
            }
        })
    ),
    getSingleQuotation: commonController.getSingle(Quotation, () => (
        {
            dataTobeRetrieved: "_id job spareParts",
            populate1: {
                path: 'job',
                select: '_id vehicleNumber issues advancePay odometer estimatedDelivery vehicleReceivedFrom vehicleReceivedFrom vehicleCollectedBy status',
                populate: {
                    path: 'vehicleNumber',
                    select: '_id number numberDetails model customerName customerMobile customerAddress',
                    populate: {
                        path: 'model',
                        select: "brand type name",
                        populate: {
                            path: "brand",
                            select: "name"
                        }
                    }
                }
            },
            populate2: {
                path: 'job',
                select: '_id vehicleNumber issues advancePay odometer estimatedDelivery vehicleReceivedFrom vehicleReceivedFrom vehicleCollectedBy status',
                populate: {
                    path: 'vehicleNumber',
                    select: '_id number numberDetails model customerName customerMobile customerAddress',
                    populate: {
                        path: 'model',
                        select: "brand type name",
                        populate: {
                            path: "type",
                            select: "type"
                        }
                    }
                }
            }
        })
    ),
    editQuotation: commonController.edit(Quotation, (req, res) => ({ _id: req.params.quotationId })),
    deleteQuotation: commonController.deleteSingle(Quotation, (req, res) => ({ _id: req.params.quotationId })),
    deleteAllQuotations: commonController.deleteAll(Quotation),
    notFound: commonController.notFound()
};