const Type = require("../models/Type");

module.exports = {
    async getAll(req, res){
        const types = await Type.findAll({
            attributes: ['descripion']
        });

        return res.json(types);
    },

    async getById(req, res){
        const { id } = req.body;
        const type = await Type.findOne({
            where: {
                id: id
            },
            attributes: ['description']
        });
        return res.json(type);
    }
}