const express = require('express');
const router = express.Router();
const data = require("../data");
const usersData = data.users;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
    function (email, password, done) {
        let user = usersData.getVendorByEmail(email);
        if (user === undefined) {
            return done("User is not found");
        }
        else {
            bcrypt.compare(password, user.hashedPassword, function (err, res) {
                if (err) {
                    return done(err);
                }
                if (res === true) {
                    return done(null, saloonDetails);
                }
                else if (res === false) {
                    return done(null, false);
                }
            });
        }
    }
));

passport.serializeUser((user, obj) => {
    obj(null, user._id);
});

passport.deserializeUser((id, obj) => {
    let userDetails = usersData.getVendorById(id);
    if (userDetails === undefined) {
        return obj("There is error");
    }
    else {
        obj(null, userDetails);
    }
});

router.post('/login2323',
    passport.authenticate('local', { failureRedirect: '/signin' }),
    function (req, res) {
        res.redirect('/72f74edd-499d-4056-bab4-5e092ba4d565');
    });

router.get("/signin", (req, res) => {
    res.render("pages/customerLogin", {});
})

router.get("/signup", (req, res) => {
    res.render("pages/CustSignUp", {});
});

router.get("/:id", (req, res) => {
    usersData.getUserById(req.params.id).then((user) => {
        res.json(user);
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