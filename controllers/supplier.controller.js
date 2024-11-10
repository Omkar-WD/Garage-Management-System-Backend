const Supplier = require("../modals/supplier.modal");
const commonController = require("./common.controller");

module.exports = {
    createSupplier: commonController.create(Supplier, (req, res) => ({ name: req.body.name })),
    getAllSuppliers: commonController.getAll(Supplier, (req, res) => (
        {
            dataTobeRetrieved: "_id name mobile email gst inventory"
        })
    ),
    getSingleSupplier: commonController.getSingle(Supplier, (req, res) => (
        {
            query: { _id: req.params.supplierId },
            dataTobeRetrieved: "_id name mobile email gst inventory"
        })
    ),
    editSupplier: commonController.edit(Supplier, (req, res) => ({ _id: req.params.supplierId })),
    deleteSupplier: commonController.deleteSingle(Supplier, (req, res) => ({ _id: req.params.supplierId })),
    notFound: commonController.notFound()
};