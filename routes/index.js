/******************************************
 *  Author : Harsh Jagdishbhai Kevadia   
 *  Created On : Fri Jul 21 2017
 *  File : index.js
 *******************************************/
const vendorRoutes = require("./vendors");
const userRoutes = require("./users");
const path = require('path');

const constructorMethod = (app) => {
    app.use("/vendors", vendorRoutes);
    app.use("/", userRoutes);

    app.use("*", (req, res) => {
        res.redirect("/");
    });
};

module.exports = constructorMethod;