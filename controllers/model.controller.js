const express = require("express");
const router = express.Router();
const { validationResult, Result, check } = require("express-validator");
const Model = require("../models/model.model");
const CONSTS = require("../helper/consts");

//Create Model
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

            let model = await Model.findOne({ modelName: req.body.modelName })
                .lean()
                .exec();

            if (model) {
                return res
                    .status(CONSTS.STATUS.BAD_REQUEST)
                    .send({ success: false, message: "Model already exist" });
            }
            model = await Model.create(req.body);
            model = await Model.findById(model._id);

            return res.status(CONSTS.STATUS.CREATED).send({
                success: true,
                model,
            });
        } catch (error) {
            return res
                .status(CONSTS.STATUS.BAD_REQUEST)
                .send({ success: false, message: error.message });
        }
    }
);

//Get Models List
router.get("/all-models", async (req, res) => {
    try {
        const models = await Model.find(
            {}
        )
            .populate("brandName")
            .populate("modelType")
            .lean()
            .exec();
        return res.status(CONSTS.STATUS.OK).send({ success: true, models });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

//Get Model
router.get("/:modelId", async (req, res) => {
    try {
        const model = await Model.findById(
            { _id: req.params.modelId }
        )
            .populate("brandName")
            .populate("modelType")
            .lean()
            .exec();
        if (!model) throw { message: "Model not exists!" };
        return res.status(CONSTS.STATUS.OK).send({ success: true, model });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

// Delete Model
router.delete("/delete/:modelId", async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(CONSTS.STATUS.BAD_REQUEST).send({
                success: false,
                message: "Only admin user can perform delete operation!",
            });
        }
        await Model.findByIdAndDelete({ _id: req.params.modelId });
        res
            .status(CONSTS.STATUS.OK)
            .send({ success: true, message: "model deleted!" });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

// Edit Model
router.patch("/edit/:modelId", async (req, res) => {
    Model.findByIdAndUpdate({ _id: req.params.modelId }, req.body, { new: true, runValidators: true })
        .populate("brandName")
        .populate("modelType")
        .then(updatedModel => {
            if (!updatedModel) {
                return res.status(CONSTS.STATUS.BAD_REQUEST).send('Model not found');
            }
            res
                .status(CONSTS.STATUS.OK)
                .send({ success: true, message: "model details updated!", model: updatedModel });
        })
        .catch(error => {
            return res
                .status(CONSTS.STATUS.BAD_REQUEST)
                .send({ success: false, message: error.message });
        });

});

module.exports = router;