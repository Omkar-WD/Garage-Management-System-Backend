const express = require("express");
const router = express.Router();
const { validationResult, Result, check } = require("express-validator");
const Quotation = require("../models/quotation.model");
const CONSTS = require("../helper/consts");

//Create Quotation
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
            let quotation = await Quotation.create(req.body);
            quotation = await Quotation.findById(quotation._id).populate({
                path: 'job',
                populate: { path: 'vehicleNumber' }
            });
            return res.status(CONSTS.STATUS.CREATED).send({
                success: true,
                quotation
            });
        } catch (error) {
            return res
                .status(CONSTS.STATUS.BAD_REQUEST)
                .send({ success: false, message: error.message });
        }
    }
);

//Get Quotation List
router.get("/all-quotations", async (req, res) => {
    try {
        const quotations = await Quotation.find(
            {}
        )
            .populate({
                path: 'job',
                populate: { path: 'vehicleNumber' }
            })
            .lean()
            .exec();
        return res.status(CONSTS.STATUS.OK).send({ success: true, quotations });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

//Get Quotation
router.get("/:quotationId", async (req, res) => {
    try {
        const quotation = await Quotation.findById(
            { _id: req.params.quotationId }
        )
            .populate({
                path: 'job',
                populate: { path: 'vehicleNumber' }
            })
            .lean()
            .exec();
        if (!quotation) throw { message: "quotations not exists!" };
        return res.status(CONSTS.STATUS.OK).send({ success: true, quotation });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

// Delete Quotation
router.delete("/delete/:quotationId", async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(CONSTS.STATUS.BAD_REQUEST).send({
                success: false,
                message: "Only admin user can perform delete operation!",
            });
        }
        await Quotation.findByIdAndDelete({ _id: req.params.quotationId });
        res
            .status(CONSTS.STATUS.OK)
            .send({ success: true, message: "quotation deleted!" });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

// Edit Quotation
router.patch("/edit/:quotationId", async (req, res) => {
    Quotation.findByIdAndUpdate({ _id: req.params.quotationId }, req.body, { new: true, runValidators: true })
        .populate({
            path: 'job',
            populate: { path: 'vehicleNumber' }
        })
        .then(updatedQuotation => {
            if (!updatedQuotation) {
                return res.status(CONSTS.STATUS.BAD_REQUEST).send('Quotation not found');
            }
            res
                .status(CONSTS.STATUS.OK)
                .send({ success: true, message: "quotation details updated!", quotation: updatedQuotation });
        })
        .catch(error => {
            return res
                .status(CONSTS.STATUS.BAD_REQUEST)
                .send({ success: false, message: error.message });
        });

});

module.exports = router;