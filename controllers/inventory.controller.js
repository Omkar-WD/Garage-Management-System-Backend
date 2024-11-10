const Inventory = require("../modals/inventory.modal");
const commonController = require("./common.controller");

module.exports = {
    createInventory: commonController.create(Inventory, (req, res) => ({ name: req.body.name })),
    getAllInventories: commonController.getAll(Inventory, (req, res) => (
        {
            dataTobeRetrieved: "_id supplierName name number unitPrice quanitity"
        })
    ),
    getSingleInventory: commonController.getSingle(Inventory, (req, res) => (
        {
            query: { _id: req.params.inventoryId },
            dataTobeRetrieved: "_id supplierName name number unitPrice quanitity"
        })
    ),
    editInventory: commonController.edit(Inventory, (req, res) => ({ _id: req.params.inventoryId })),
    deleteInventory: commonController.deleteSingle(Inventory, (req, res) => ({ _id: req.params.inventoryId })),
    notFound: commonController.notFound()
};