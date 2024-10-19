const express = require("express");
const router = express.Router();
const { validationResult, Result, check } = require("express-validator");
const Brand = require("../models/brand.model");
const CONSTS = require("../helper/consts");

//Create Brand
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

            let brand = await Brand.findOne({ brandName: req.body.brandName })
                .lean()
                .exec();

            if (brand) {
                return res
                    .status(CONSTS.STATUS.BAD_REQUEST)
                    .send({ success: false, message: "Brand already exist" });
            }
            brand = await Brand.create(req.body);
            brand = await Brand.findById(brand._id);

            return res.status(CONSTS.STATUS.CREATED).send({
                success: true,
                brand,
            });
        } catch (error) {
            return res
                .status(CONSTS.STATUS.BAD_REQUEST)
                .send({ success: false, message: error.message });
        }
    }
);

//Get Brands List
router.get("/all-brands", async (req, res) => {
    try {
        const brands = await Brand.find(
            {}
        )
            .lean()
            .exec();
        return res.status(CONSTS.STATUS.OK).send({ success: true, brands });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

//Get Brand
router.get("/:brandId", async (req, res) => {
    try {
        const brand = await Brand.findById(
            { _id: req.params.brandId }
        )
            .lean()
            .exec();
        if (!brand) throw { message: "Brand not exists!" };
        return res.status(CONSTS.STATUS.OK).send({ success: true, brand });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

// Delete Brand
router.delete("/delete/:brandId", async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(CONSTS.STATUS.BAD_REQUEST).send({
                success: false,
                message: "Only admin user can perform delete operation!",
            });
        }
        await Brand.findByIdAndDelete({ _id: req.params.brandId });
        res
            .status(CONSTS.STATUS.OK)
            .send({ success: true, message: "brand deleted!" });
    } catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
});

// Edit Brand
router.patch("/edit/:brandId", async (req, res) => {
    Brand.findByIdAndUpdate({ _id: req.params.brandId }, req.body, { new: true, runValidators: true })
        .then(updatedBrand => {
            if (!updatedBrand) {
                return res.status(CONSTS.STATUS.BAD_REQUEST).send('Brand not found');
            }
            res
                .status(CONSTS.STATUS.OK)
                .send({ success: true, message: "brand details updated!", brand: updatedBrand });
        })
        .catch(error => {
            return res
                .status(CONSTS.STATUS.BAD_REQUEST)
                .send({ success: false, message: error.message });
        });

});

module.exports = router;