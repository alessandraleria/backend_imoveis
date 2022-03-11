const Properties = require("../models/Properties");
const { search } = require("../routes");
const { Op } = require('@sequelize/core');

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
    },

    async filter(req, res){
        const { id, search, property_type, max_value, min_value } = req.body;
        const filtered = await Properties.findAll({
            where: {
                id_user: id,
                [Op.or]: [
                    {address:
                        {[Op.like]: search ? '%' + search + '%' : '%' }
                    },
                    {zip_code: 
                        {[Op.like]: search ? '%' + search + '%' : '%' }
                    },
                    {city: 
                        {[Op.like]: search ? '%' + search + '%' : '%' }
                    },
                    {country: 
                        {[Op.like]: search ? '%' + search + '%' : '%' }
                    },
                ],
                property_type: property_type ? property_type : {[Op.between]: [0, 99999999]},
                value: {[Op.between]: [min_value ? min_value : 0, max_value ? max_value : 99999999]}
            },
        });
        return res.json(filtered);
    }
    
}