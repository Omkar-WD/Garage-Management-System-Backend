const Inventory = require("../modals/inventory.modal");
const commonController = require("./common.controller");
const CONSTS = require("../helper/consts");

const createOrUpdateInventoryItems = () => async (req, res) => {
    const modalName = req.modalName;
    try {
        req.logger.debug(`Received request to create the ${modalName} data`);

        if (!req.body.supplierName) {
            throw {
                message: "Supplier name missing!"
            }
        }

        if (!req.body.inventories) {
            throw {
                message: "Inventories missing!"
            }
        }

        // 1. Check if the inventory exist or not
        let existingInventory = await Inventory.findOne({ supplierName: req.body.supplierName });
        if (!existingInventory) {
            let data = await Inventory.create(req.body);
            const message = `${modalName} created`;
            req.logger.info(message);
            return res.status(CONSTS.STATUS.CREATED).send({
                success: true,
                message
            })
        }

        let response = [];

        for (const inventory of req.body.inventories) {
            // 2. If inventory exists for the supplier, check if the inventoryItem exists or not by using name 
            let existingItem = existingInventory.inventories.find(item => item.name === inventory.name);
            // 3. If the inventory item exists, update it
            if (existingItem) {
                existingItem.name = inventory.name || existingItem.name;
                existingItem.number = inventory.number || existingItem.number;
                existingItem.unitPrice = inventory.unitPrice || existingItem.unitPrice;
                existingItem.quantity = (existingItem.quantity || 1) + inventory.quantity;  // Add to quantity if it's provided

                await existingInventory.save();
                console.log("Updated existing inventory item:", existingItem);
                response.push(existingItem);
            }
            else {
                // 4. If the inventory item does not exist, create a new item in the inventories array
                existingInventory.inventories.push({
                    name: inventory.name,
                    number: inventory.number,
                    unitPrice: inventory.unitPrice,
                    quantity: inventory.quanitity,
                });
                await existingInventory.save();
                req.logger.info("Created new inventory item in existing inventory:", existingInventory);
                response.push(existingInventory.inventories[existingInventory.inventories.length - 1]);
            }
        }
        const message = "Inventory created/updated successfully";
        return res
            .status(CONSTS.STATUS.OK)
            .send({ success: true, message });
    }
    catch (error) {
        req.logger.error(`Received error while creating/updating ${modalName} details data`, error);
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
};

const updateInventoryItems = () => async (req, res) => {
    const modalName = req.modalName;
    try {
        req.logger.debug(`Received request to update the ${modalName} data`);
        const message = `${modalName}'s inner items details updated!`;
        if (!req.body.inventories) {
            throw {
                message: "Inventories missing!"
            }
        }
        const bulkUpdates = req.body.inventories.map((inventory) => {
            const updateFields = {
                ...(inventory.name && { "inventories.$.name": inventory.name }),
                ...(inventory.number && { "inventories.$.number": inventory.number }),
                ...(inventory.unitPrice && { "inventories.$.unitPrice": inventory.unitPrice }),
                ...(inventory.quanitity && { "inventories.$.quanitity": inventory.quanitity })
            };
            return {
                updateOne: {
                    filter: { "inventories._id": inventory._id },
                    update: { $set: updateFields }
                }
            };
        });
        const result = await Inventory.bulkWrite(bulkUpdates)
        req.logger.info(message, result);
        return res
            .status(CONSTS.STATUS.OK)
            .send({ success: true, message });
    }
    catch (error) {
        req.logger.error(`Received error while updating ${modalName}'s inner items details data`, error);
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
};

module.exports = {
    createInventory: createOrUpdateInventoryItems(),
    getAllInventories: commonController.getAll(Inventory, (req, res) => (
        {
            dataTobeRetrieved: "_id supplierName inventories"
        })
    ),
    getSingleInventory: commonController.getSingle(Inventory, (req, res) => (
        {
            query: { _id: req.params.inventoryId },
            dataTobeRetrieved: "_id supplierName inventories"
        })
    ),
    editInventory: updateInventoryItems(),
    deleteInventory: commonController.deleteSingle(Inventory, (req, res) => ({ _id: req.params.inventoryId })),
    notFound: commonController.notFound()
};