const express = require('express');
const router = express.Router();
const data = require("../data");
const usersData = data.users;

router.get("/signup", (req, res) => {
    res.render("pages/CustSignUp", {});
});



router.get("/:id", (req, res) => {
    usersData.getUserById(req.params.id).then((user) => {
        res.render("pages/salon",user);
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