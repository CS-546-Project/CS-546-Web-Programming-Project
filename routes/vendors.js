const express = require('express');
const router = express.Router();
const data = require("../data");
const vendorsData = data.vendors;

router.get("/:id", (req, res) => {
    vendorsData.getVendorById(req.params.id).then((vendor) => {
        console.log(vendor);
        res.render("pages/owner",vendor);
    }).catch(() => {
        res.status(404).json({ error: "Vendor not found" });
    });
});

router.post("/", (req, res) => {
    let vendorBody = req.body;
    vendorsData.addVendor(vendorBody.saloonName, vendorBody.address, vendorBody.contactNumber, vendorBody.state,
        vendorBody.city, vendorBody.zipCode, vendorBody.email, vendorBody.password)
        .then((newVendor) => {
            res.json(newVendor);
        }).catch((e) => {
            res.status(500).json({ error: e });
        });
});

router.put("/:id", (req, res) => {
    let updatedData = req.body;
    let getVendor = vendorsData.getVendorById(req.params.id);
    getVendor.then(() => {
        return vendorsData.updateVendorInfo(req.params.id, updatedData)
            .then((updatedVendor) => {
                res.json(updatedVendor);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch((e) => {
        console.log(e);
        res.status(404).json({ error: "Vendor not found" });
    });

});
router.delete("/:id", (req, res) => {
    let getVendor = vendorsData.getVendorById(req.params.id);

    getVendor.then(() => {
        return vendorsData.removeVendor(req.params.id)
            .then(() => {
                res.sendStatus(200);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch(() => {
        res.status(404).json({ error: "Vendor not found" });
    });
});

router.get("/reviews/:id", (req, res) => {
    vendorsData.getReviewsFromReviewId(req.params.id).then((reviews) => {
        res.json(reviews);
    }).catch((e) => {
        console.log(e);
        res.status(500).json({ error: e });
    });
});

router.post("/:id", (req, res) => {
    let reviewBody = req.body;
    let getReview = vendorsData.getReviewsFromReviewId(req.params.id);

    vendorsData.addReviews(getReview._id, commentBody.poster, commentBody.comment)
        .then((newComment) => {
            res.json(newComment);
        }).catch((e) => {
            console.log(e);

            res.status(500).json({ error: e });
        });
});



module.exports = router;