const PropertyType = require("../models/PropertyType");

module.exports = {
    async getAll(req, res){
        const types = await PropertyType.findAll();

        return res.json(types);
    },

    async getById(req, res){
        const { id } = req.body;
        const type = await PropertyType.findOne({
            where: {
                id: id
            }
        });
        return res.json(type);
    }
}