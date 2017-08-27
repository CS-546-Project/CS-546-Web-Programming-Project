const usersRoutes = require("./users");
const vendorsRoutes = require("./vendors");
const hairCuttersRoutes = require("./hairCutters");
const servicesRoutes = require("./services");
const tmpRoutes = require("./tmp");

const constructorMethod = (app) => {
    app.use("/users", usersRoutes);
    app.use("/vendors", vendorsRoutes);
    app.use("/hairCutters", hairCuttersRoutes);
    app.use("/services", servicesRoutes);
        app.use("/tmp", tmpRoutes);


    app.use("*", (req, res) => {
        res.status(404).json({error: "Not found"});
    });
};

module.exports = constructorMethod;