const http = require("http");
const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv-safe").config();

require("./database");

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method == "OPTIONS"){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    app.use(cors());
    next();
});

app.use(routes);

app.listen(3030);