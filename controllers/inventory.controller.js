const Inventory = require("../modals/inventory.modal");
const commonController = require("./common.controller");
const CONSTS = require("../helper/consts");

const createOrUpdateInventoryItems = () => async (req, res) => {
    const modalName = req.modalName;
    try {
        req.logger.debug(`Received request to create the ${modalName} data`);

        if (!req.body.supplierName) {
            const message = "Supplier name missing!";
            req.logger.error(`Received error as ${message} for ${modalName}`);
            throw { message }
        }

        if (!req.body.inventories) {
            const message = "Inventories missing!";
            req.logger.error(`Received error as ${message} for ${modalName}`);
            throw { message }
        }

        // 1. Check if the inventory exist or not
        let existingInventory = await Inventory.findOne({ supplierName: req.body.supplierName });
        if (!existingInventory) {
            req.logger.info(`Inventory not available for this supplier ${req.body.supplierName}`);
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
                req.logger.info(`Inventory is available for this item ${inventory.name}`);
                existingItem.name = inventory.name || existingItem.name;
                existingItem.number = inventory.number || existingItem.number;
                existingItem.unitPrice = inventory.unitPrice || existingItem.unitPrice;
                existingItem.quantity = (existingItem.quantity || 1) + inventory.quantity;  // Add to quantity if it's provided

                await existingInventory.save();
                response.push(existingItem);
            }
            else {
                req.logger.info(`Inventory is not available for this item ${inventory.name}, so creating new`);
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
        req.logger.info(message);
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
            req.logger.error(`Received error as inventories are missing for ${modalName}`);
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

const deleteItem = () => async (req, res) => {
    const modalName = req.modalName;
    try {
        req.logger.debug(`Received request to delete the inventory item`);
        const result = await Inventory.updateOne(
            { _id: req.params.inventoryId },  // Find the document by inventoryId
            { $pull: { inventories: { _id: req.params.itemId } } }  // Remove the item from inventories by itemId
        );
        let message = ""
        if (result.nModified === 0) {
            message = "No items were deleted";
        } else {
            message = "inventory Item successfully deleted";
        }
        req.logger.info(message, result);
        return res
            .status(CONSTS.STATUS.OK)
            .send({ success: true, message });
    }
    catch (error) {
        req.logger.error(`Received error while deleting ${modalName}'s inner items details data`, error);
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
}

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
    deleteInventoryItem: deleteItem(),
    deleteAllInventories: commonController.deleteAll(Inventory),
    notFound: commonController.notFound()
};