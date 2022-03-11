const { Model, DataTypes } = require("@sequelize/core");

class Type extends Model {
    static init(sequelize){
        super.init({
            descrption: DataTypes.STRING,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE
        }, {
            sequelize
        })
    }
}

module.exports = Type;