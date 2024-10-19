const Type = require("../modals/type.modal");
const commonController = require("./common.controller");

module.exports = {
    createType: commonController.create(Type, (req, res) => ({ type: req.body.type })),
    getAllTypes: commonController.getAll(Type, (req, res) => (
        {
            dataTobeRetrieved: "_id  type"
        })
    ),
    getSingleType: commonController.getSingle(Type, (req, res) => (
        {
            query: { _id: req.params.typeId },
            dataTobeRetrieved: "_id type"
        })
    ),
    editType: commonController.edit(Type, (req, res) => ({ _id: req.params.typeId })),
    deleteType: commonController.deleteSingle(Type, (req, res) => ({ _id: req.params.typeId })),
    notFound: commonController.notFound()
};