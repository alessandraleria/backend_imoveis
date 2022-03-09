const Properties = require("../models/Properties");

module.exports = {
    async index(req, res){
        const properties = await Properties.findAll();
        return res.json(properties);
    },

    async findByUserId(req, res){
        const { id_user } = req.body;
        console.log(id_user);
        const properties = await Properties.findAll({
            where: {
                id_user: id_user
            },
        });
        return res.json(properties);
    },

    async findById(req, res){
        const { id, id_user } = req.body;
        console.log(id);
        console.log(id_user);
        const property = await Properties.findOne({
            where: {
                id: id,
                id_user: id_user
            },
        });
        return res.json(property);
    }
    
}