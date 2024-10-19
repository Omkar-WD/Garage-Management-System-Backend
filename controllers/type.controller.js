const express = require("express");
const router = express.Router();
const { validationResult, Result, check } = require("express-validator");
const Type = require("../models/type.model");
const CONSTS = require("../helper/consts");

//Create Type
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

            let type = await Type.findOne({ vehicleType: req.body.vehicleType })
                .lean()
                .exec();

            if (type) {
                return res
                    .status(CONSTS.STATUS.BAD_REQUEST)
                    .send({ success: false, message: "Type already exist" });
            }
            type = await Type.create(req.body);
            type = await Type.findById(type._id);

            return res.status(CONSTS.STATUS.CREATED).send({
                success: true,
                type,
            });
        } catch (error) {
            return res
                .status(CONSTS.STATUS.BAD_REQUEST)
                .send({ success: false, message: error.message });
        }
    }
);

//Get Types List
router.get("/all-types", async (req, res) => {
    try {
        const types = await Type.find(
            {}
        )
            .lean()
            .exec();
        return res.status(CONSTS.STATUS.OK).send({ success: true, types });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

//Get Type
router.get("/:typeId", async (req, res) => {
    try {
        const type = await Type.findById(
            { _id: req.params.typeId }
        )
            .lean()
            .exec();
        if (!type) throw { message: "Type not exists!" };
        return res.status(CONSTS.STATUS.OK).send({ success: true, type });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

// Delete Type
router.delete("/delete/:typeId", async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(CONSTS.STATUS.BAD_REQUEST).send({
                success: false,
                message: "Only admin user can perform delete operation!",
            });
        }
        await Type.findByIdAndDelete({ _id: req.params.typeId });
        res
            .status(CONSTS.STATUS.OK)
            .send({ success: true, message: "type deleted!" });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

// Edit Type
router.patch("/edit/:typeId", async (req, res) => {
    Type.findByIdAndUpdate({ _id: req.params.typeId }, req.body, { new: true, runValidators: true })
        .then(updatedType => {
            if (!updatedType) {
                return res.status(CONSTS.STATUS.BAD_REQUEST).send('Type not found');
            }
            res
                .status(CONSTS.STATUS.OK)
                .send({ success: true, message: "type details updated!", type: updatedType });
        })
        .catch(error => {
            return res
                .status(CONSTS.STATUS.BAD_REQUEST)
                .send({ success: false, message: error.message });
        });

});

module.exports = router;