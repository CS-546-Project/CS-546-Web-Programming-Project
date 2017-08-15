/******************************************
 *  Author : Harsh Jagdishbhai Kevadia   
 *  Created On : Fri Jul 21 2017
 *  File : index.js
 *******************************************/
const vendorRoutes = require("./vendors");
const userRoutes = require("./users");

let constructorMethod = (app) => {
    app.use("/vendor", vendorRoutes);
    app.use("/user", userRoutes);
};

module.exports = {
    users: require("./users"),
    posts: require("./vendors")
};