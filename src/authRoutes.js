const express = require("express");
const Auth = require("./controllers/auth");

const routes = express.Router();

routes.post("/auth/login", Auth.loginUser);
routes.post("/auth/logout", Auth.logout);
routes.post("/auth/google", Auth.googleLogin);

module.exports = routes;