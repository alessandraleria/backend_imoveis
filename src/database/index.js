const Sequelize = require("@sequelize/core");
const dbConfig = require("../config/database");

const User = require("../models/User");
const Product = require("../models/Product");
const Properties = require("../models/Properties");

const connection = new Sequelize(dbConfig);

User.init(connection);
Product.init(connection);
Properties.init(connection);

module.exports = connection;