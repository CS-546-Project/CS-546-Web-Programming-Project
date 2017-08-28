const express = require('express');
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const vendorsData = data.vendors;

router.get("/", (req, res) => {
    res.render("pages/search_salon", {});
});

router.get("/signup", (req, res) => {
    res.render("pages/CustSignUp", {});
});
router.get("/salon/:id", (req, res) => {
    vendorsData.getVendorById(req.params.id).then((vendor) => {
        res.render("pages/salon", vendor);
    }).catch(() => {
        res.status(404).json({ error: "Salon not found" });
    });
});

router.post("/search", (req, res) => {
    let vendorBody = req.body;
    console.log(vendorBody.searchText);
    vendorsData.getVendorsBySearch(vendorBody.searchText)
        .then((newVendor) => {
            res.render("pages/search_salon", newVendor);
        }).catch((e) => {
            res.status(500).json({ error: e });
        });
});
router.get("/:id", (req, res) => {
    usersData.getUserById(req.params.id).then((user) => {
        res.render("pages/search_salon", user);
    }).catch(() => {
        res.status(404).json({ error: "User not found" });
    });
});

router.post("/", (req, res) => {
    let userBody = req.body;
    usersData.addUser(userBody.firstName, userBody.lastName, userBody.address, userBody.contactNumber,
        userBody.state, userBody.city, userBody.zipCode, userBody.email, userBody.password)
        .then((newUser) => {
            res.json(newUser);
        }).catch((e) => {
            res.status(500).json({ error: e });
        });
});

router.put("/:id", (req, res) => {
    let updatedData = req.body;
    let getUser = usersData.getUserById(req.params.id);
    getUser.then(() => {
        return usersData.updateUserInfo(req.params.id, updatedData)
            .then((updatedUser) => {
                res.json(updatedUser);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch((e) => {
        console.log(e);
        res.status(404).json({ error: "User not found" });
    });

});

router.delete("/:id", (req, res) => {
    let getUser = usersData.getUserById(req.params.id);

    getUser.then(() => {
        return usersData.removeUser(req.params.id)
            .then(() => {
                res.sendStatus(200);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch(() => {
        res.status(404).json({ error: "User not found" });
    });
});
module.exports = router;