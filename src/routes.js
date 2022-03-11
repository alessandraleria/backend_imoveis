const express = require("express");

const User = require("./controllers/user");
const Product = require("./controllers/product");
const Properties = require("./controllers/properties");
const Auth = require("./controllers/auth");

const routes = express.Router();

routes.post("/auth/login", Auth.loginUser);
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

module.exports = routes;