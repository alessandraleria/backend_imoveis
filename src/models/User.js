const { Model, DataTypes } = require("@sequelize/core");

class User extends Model {
    static init(sequelize){
        super.init({
            user_type: DataTypes.INTEGER,
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            photo: DataTypes.STRING,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE
        }, {
            sequelize
        })
    }
}

module.exports = User;