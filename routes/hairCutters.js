const express = require('express');
const router = express.Router();
const data = require("../data");
const hairCuttersData = data.hairCutters;

router.get("/:id", (req, res) => {
    hairCuttersData.gethairCutterById(req.params.id).then((hairCutters) => {
        res.render("pages/stylists",hairCutters);
    }).catch(() => {
        res.status(404).json({ error: "Hair Cutter not found" });
    });
});
router.post("/", (req, res) => {
    let hairCutterBody = req.body;

    hairCuttersData.addhairCutter(hairCutterBody.vendorId, hairCutterBody.firstName, hairCutterBody.lastName,
        hairCutterBody.heading, hairCutterBody.image, hairCutterBody.description)
        .then((newHairCutter) => {
            res.json(newHairCutter);
        }).catch((e) => {
            res.status(500).json({ error: e });
        });
});

router.put("/:id", (req, res) => {
    let updatedData = req.body;

    let getHairCutter = hairCuttersData.gethairCutterById(req.params.id);

    getHairCutter.then(() => {
        return hairCuttersData.updatehairCutterInfo(req.params.id, updatedData)
            .then((updatedHairCutter) => {
                res.json(updatedHairCutter);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch((e) => {
      //  console.log(e);
        res.status(404).json({ error: "Hair Cutter not found" });
    });

});

router.delete("/:id", (req, res) => {
    let getHairCutter = hairCuttersData.gethairCutterById(req.params.id);

    getHairCutter.then(() => {
        return hairCuttersData.removehairCutter(req.params.id)
            .then(() => {
                res.sendStatus(200);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch(() => {
        res.status(404).json({ error: "Hair Cutter not found" });
    });
});
module.exports = router;