/******************************************
 *  Author : Harsh Jagdishbhai Kevadia   
 *  Created On : Fri Jul 21 2017
 *  File : index.js
 *******************************************/
const vendorRoutes = require("./vendors");
const userRoutes = require("./users");
const hairCutterRoutes = require("./hairCutters");
const serviceRoutes = require("./services");

let constructorMethod = (app) => {
    app.use("/vendor", vendorRoutes);
    app.use("/user", userRoutes);
    app.use("/hairCutter", hairCutterRoutes);
    app.use("/service", serviceRoutes);
};

module.exports = {
    users: require("./users"),
    vendors: require("./vendors"),
    hairCutters: require("./hairCutters"),
    services: require("./services")
};