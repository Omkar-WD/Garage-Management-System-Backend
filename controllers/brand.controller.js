const Brand = require("../modals/brand.modal");
const commonController = require("./common.controller");

module.exports = {
    createBrand: commonController.create(Brand, (req, res) => ({ brandName: req.body.brandName })),
    getAllBrands: commonController.getAll(Brand, (req, res) => (
        {
            dataTobeRetrieved: "_id name"
        })
    ),
    getSingleBrand: commonController.getSingle(Brand, (req, res) => (
        {
            query: { _id: req.params.brandId },
            dataTobeRetrieved: "_id name"
        })
    ),
    editBrand: commonController.edit(Brand, (req, res) => ({ _id: req.params.brandId })),
    deleteBrand: commonController.deleteSingle(Brand, (req, res) => ({ _id: req.params.brandId })),
    notFound: commonController.notFound()
};