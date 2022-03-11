const RentType = require("../models/RentType");

module.exports = {
    async getAll(req, res){
        const types = await RentType.findAll();

        return res.json(types);
    },

    async getById(req, res){
        const { id } = req.body;
        const type = await RentType.findOne({
            where: {
                id: id
            }
        });
        return res.json(type);
    }
}