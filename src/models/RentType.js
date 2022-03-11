const { Model, DataTypes } = require("@sequelize/core");

class RentType extends Model {
    static init(sequelize){
        super.init({
            description: DataTypes.STRING
        }, {
            sequelize
        })
    }
}

module.exports = RentType;