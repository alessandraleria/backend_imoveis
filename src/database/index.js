const Sequelize = require("@sequelize/core");
const dbConfig = require("../config/database");

const User = require("../models/User");
const Product = require("../models/Product");
const Properties = require("../models/Properties");
const RentType = require("../models/RentType");
const PropertyType = require("../models/PropertyType");

const connection = new Sequelize(dbConfig);

User.init(connection);
Product.init(connection);
Properties.init(connection);
RentType.init(connection);
PropertyType.init(connection);

module.exports = connection;