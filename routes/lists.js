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

router.get("/:list", (req, res) => {
    var Source;
    if (req.params.list === "captionSource") Source = CaptionSource;
    else if (req.params.list === "genre") Source = Genre;
    else if (req.params.list === "videoSource") Source = VideoSource;
    else return res.status(400).json({ msg: "List not found" });
    Source.find((err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});
router.post("/:list", checkSchema(validatorN), auth.block(auth.roles.write), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    var Source;
    if (req.params.list === "captionSource") Source = CaptionSource;
    else if (req.params.list === "genre") Source = Genre;
    else if (req.params.list === "videoSource") Source = VideoSource;
    else return res.status(400).json({ msg: "List not found" });
    const { name } = req.body;
    const newEntry = new Source({ name });
    newEntry
        .save()
        .then((entry) => {
            res.json(entry);
        })
        .catch((err) => {
            console.error(err);
        });
});
router.put("/:list", checkSchema(validatorIDN), auth.block(auth.roles.write), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    var Source;
    if (req.params.list === "captionSource") Source = CaptionSource;
    else if (req.params.list === "genre") Source = Genre;
    else if (req.params.list === "videoSource") Source = VideoSource;
    else return res.status(400).json({ msg: "List not found" });
    const { name, id } = req.body;
    Source.findByIdAndUpdate(id, { name }, (err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});
router.delete("/:list", checkSchema(validatorID), auth.block(auth.roles.write), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    var Source;
    if (req.params.list === "captionSource") Source = CaptionSource;
    else if (req.params.list === "genre") Source = Genre;
    else if (req.params.list === "videoSource") Source = VideoSource;
    else return res.status(400).json({ msg: "List not found" });
    const { id } = req.body;
    Source.findByIdAndDelete(id, (err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});
router.get("/:list/:id", (req, res) => {
    var Source;
    if (req.params.list === "captionSource") Source = CaptionSource;
    else if (req.params.list === "genre") Source = Genre;
    else if (req.params.list === "videoSource") Source = VideoSource;
    else return res.status(400).json({ msg: "List not found" });
    Source.findById(req.params.id, (err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});
module.exports = router;
