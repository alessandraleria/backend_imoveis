const { Model, DataTypes } = require("@sequelize/core");

class Properties extends Model {
    static init(sequelize){
        super.init({
            id_user: DataTypes.INTEGER,
            image: DataTypes.STRING,
            value: DataTypes.STRING,
            rent_value: DataTypes.STRING,
            rent_type: DataTypes.INTEGER,
            rented: DataTypes.INTEGER,
            address: DataTypes.STRING,
            number: DataTypes.STRING,
            zip_code: DataTypes.STRING,
            city: DataTypes.STRING,
            state: DataTypes.STRING,
            country: DataTypes.STRING,
            property_type: DataTypes.INTEGER,
            latitude: DataTypes.STRING,
            longitude: DataTypes.STRING,
            description: DataTypes.STRING
        }, {
            sequelize
        })
    }
}

module.exports = Properties;