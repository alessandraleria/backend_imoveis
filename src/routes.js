const express = require("express");

const User = require("./controllers/user");
const Product = require("./controllers/product");
const Properties = require("./controllers/properties");
const Auth = require("./controllers/auth");
const RentTypes = require("./controllers/rent_type");
const PropertyType = require("./controllers/property_type");

const routes = express.Router();

routes.post("/auth/login", Auth.login);
routes.post("/auth/logout", Auth.logout);
routes.post("/auth/google", Auth.googleLogin);
routes.get("/user", Auth.checkUser);

routes.get("/users", User.index);
routes.post("/users/find", User.findByCpf);
routes.post("/users/create", User.create);
routes.post("/users/redefinePassword", User.redefinePassword);
routes.get("/users/profile", User.profile);
routes.post("/users/edit", User.edit);
routes.post("/users/delete", User.delete);

routes.get("/products", Product.index);
routes.post("/products/find", Product.findById);
routes.post("/products/create", Product.create);
routes.post("/products/edit", Product.edit);
routes.post("/products/delete", Product.delete);

routes.get("/properties", Properties.index);
routes.post("/properties/findByUser", Properties.findByUserId);
routes.post("/properties/findById", Properties.findById);
routes.post("/properties/filter", Properties.filter);

routes.get("/rent-type/getAll", RentTypes.getAll);
routes.post("/rent-type/findById", RentTypes.getById);

routes.get("/property-type/getAll", PropertyType.getAll);
routes.post("/property-type/findById", PropertyType.getById);

module.exports = routes;