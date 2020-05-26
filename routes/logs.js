const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//Import Environment Variables
require("dotenv").config();

//Importing old Model
const OldLog = require("../models/OldLog");
const Log = require("../models/Log");
//@route GET api/logs
//@desc  Return Logs
//@access Public
router.get("/view", (req, res) => {
    var query = OldLog.find({ title: new RegExp(`^${req.query.search}`, "i") })
        .select("title description")
        .sort("title");
    query.exec((err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});

//@route GET api/logs/:id
//@desc  Return Specific Log
//@access Private
router.get("/fview/:id", auth, (req, res) => {
    OldLog.findById(req.params.id, (err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});

//@route GET api/logs/:id
//@desc  Return Parts of Specific Log
//@access Public
router.get("/pview/:id", (req, res) => {
    var query = OldLog.findById(req.params.id).select(
        "title description completed date_of_completion"
    );
    query.exec((err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});

router.get("/data", (req, res) => {
    res.json({
        title: "Tester",
        year: 2011,
        description: "This is a test log",
        genre: "Mr Nice",
        copyrightInfo: {
            teacherName: "Ben Woods",
            captionSource: "Captioned by me",
            dateOfCompletion: "2011-12-01",
            videoSource: "From Youtube",
            originalLocation: "The moon",
        },
        digitalInfo: [
            {
                name: "Last long test",
                length: "11:00",
                location: "X Drive",
            },
            {
                name: "Test just one more time",
                length: "13:13",
                location: "Y Drive",
            },
        ],
        physicalInfo: [
            {
                name: "Last long test",
                location: "Captioning Office",
                copiesHeld: 2,
            },
        ],
    });
});

router.get("/search", (req, res) => {
    var query = OldLog.find({
        [req.query.field]: new RegExp(req.query.value, "i"),
    }).select("title description");
    query.exec((err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});

module.exports = router;
