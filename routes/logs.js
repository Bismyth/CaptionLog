const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const fs = require("fs");
const path = require("path");
const { checkSchema, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const junk = require("junk");
//Import Environment Variables
require("dotenv").config();

//Importing old Model
const OldLog = require("../models/OldLog");
const Log = require("../models/Log");

//@route GET api/logs
//@desc  Return Logs
//@access Public
router.get("/", (req, res) => {
    var queryO, query;
    if (req.query.search) {
        queryO = OldLog.find({ title: new RegExp(`^${req.query.search}`, "i") })
            .select("title description")
            .sort("title")
            .lean();
        query = Log.find({ title: new RegExp(`^${req.query.search}`, "i") })
            .select("title description movieInfo")
            .sort("title")
            .lean();
    } else {
        queryO = OldLog.find({
            [req.query.field]: new RegExp(req.query.value, "i"),
        })
            .select("title description")
            .lean();
        query = Log.find({
            [req.query.field]: new RegExp(req.query.value, "i"),
        })
            .select("title description movieInfo")
            .lean();
    }
    Promise.all([query, queryO]).then((results) => {
        var joined = [
            ...results[0],
            ...results[1].map((value) => {
                return { ...value, old: true };
            }),
        ];
        res.json(joined.sort((a, b) => (a.title > b.title ? 1 : -1)));
    });
});

router.post("/", checkSchema(require("../validationSchema/newLog")), auth, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const newLog = new Log(req.body);
    newLog.save((err, doc) => {
        if (err) {
            console.error(err);
            return res.status(500);
        }
        res.json(doc);
    });
});

router.put("/", checkSchema(require("../validationSchema/newLog")), auth, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    Log.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {
        if (err) {
            console.error(err);
            return res.status(500);
        }
        res.json(doc);
    });
});

router.post("/scan", auth, (req, res) => {
    var basePath = process.env.MEDIA_ROOT;
    if (!req.body.path) res.status(400).json({ errors: [{ msg: "Missing Path" }] });
    var sanitizedPath = path.normalize(req.body.path).replace(/^(\.\.(\/|\\|$))+/, "");
    var search = path.join(basePath, sanitizedPath);
    var rfiles = [];
    fs.readdir(search, { withFileTypes: true }, (err, files) => {
        if (err) res.status(500).json({ errors: [{ msg: err }] });
        else if (files === undefined) res.json([]);
        else {
            files.filter(junk.not).forEach((file) => {
                rfiles.push({
                    id: path.join(sanitizedPath, file.name),
                    name: file.name,
                    isDir: file.isDirectory(),
                });
            });
            res.json(rfiles);
        }
    });
});

//@route GET api/logs/:id
//@desc  Return Specific Log
//@access Public but more info is private
router.get("/:id", (req, res) => {
    var query, Source;
    if (req.query.type === "old") Source = OldLog;
    else Source = Log;

    if (req.header("x-auth-token")) {
        try {
            const decoded = jwt.verify(req.header("x-auth-token"), process.env.JWT_SECRET);
        } catch (e) {
            console.error(e);
            return res.status(400).json({ msg: "Token is not valid" });
        }
        query = Source.findById(req.params.id);
    } else {
        query = Source.findById(req.params.id).select(
            req.query.type
                ? "title description completed date_of_completion"
                : "title description copyrightInfo.dateOfCompletion movieInfo"
        );
    }
    query.exec((err, data) => {
        if (err) {
            console.error(err);
            return res.status(400).send("Bad Request");
        }
        res.json(data);
    });
});

router.delete("/:id", auth, (req, res) => {
    if (req.user.access !== "full")
        return res.status(401).json({ msg: "You don't have privilege to do that" });
    var id = req.params.id;
    if (req.body.old) {
        OldLog.findByIdAndDelete(id, (err, doc) => {
            if (err) console.error(err);
            res.json({ msg: "Delete Sucessful" });
        });
    } else {
        Log.findByIdAndDelete(id, (err, doc) => {
            if (err) console.error(err);
            res.json({ msg: "Delete Sucessful" });
        });
    }
});

module.exports = router;
