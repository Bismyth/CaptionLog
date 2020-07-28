const express = require("express");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

//Import Environment Variables
require("dotenv").config();

const Genre = require("../models/Genre");
const CaptionSource = require("../models/CaptionSource");
const VideoSource = require("../models/VideoSource");

const validatorN = {
    name: {
        exists: { errorMessage: "Please Provide Valid Name" },
        escape: true,
    },
};
const validatorIDN = {
    name: {
        exists: { errorMessage: "Please Provide Valid Name" },
        escape: true,
    },
    id: {
        exists: { errorMessage: "Please Provide an ID" },
        escape: true,
    },
};
const validatorID = {
    id: {
        exists: { errorMessage: "Please Provide an ID" },
        escape: true,
    },
};

router.get("/captionSource", (req, res) => {
    CaptionSource.find((err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});
router.post("/captionSource", checkSchema(validatorN), auth, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
    const { name } = req.body;
    const newCaptionSource = new CaptionSource({ name });
    newCaptionSource
        .save()
        .then((captionSource) => {
            res.json(captionSource);
        })
        .catch((err) => {
            console.error(err);
        });
});
router.put("/captionSource", checkSchema(validatorIDN), auth, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
    const { name, id } = req.body;
    CaptionSource.findByIdAndUpdate(id, { name }, (err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});
router.delete("/captionSource", checkSchema(validatorID), auth, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
    const { id } = req.body;
    CaptionSource.findByIdAndDelete(id, (err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});
router.get("/genre", (req, res) => {
    Genre.find((err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});
router.get("/videoSource", (req, res) => {
    VideoSource.find((err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});

module.exports = router;
