const { Model, DataTypes } = require("@sequelize/core");

class PropertyType extends Model {
    static init(sequelize){
        super.init({
            description: DataTypes.STRING
        }, {
            sequelize
        })
    }
}

module.exports = PropertyType;