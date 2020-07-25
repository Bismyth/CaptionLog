const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const fs = require("fs");
const path = require("path");

//Import Environment Variables
require("dotenv").config();

//Importing old Model
const OldLog = require("../models/OldLog");
const Log = require("../models/Log");

//@route GET api/logs
//@desc  Return Logs
//@access Public
router.get("/", (req, res) => {
    var query;
    if (req.query.search) {
        query = OldLog.find({ title: new RegExp(`^${req.query.search}`, "i") })
            .select("title description")
            .sort("title");
    } else {
        var query = OldLog.find({
            [req.query.field]: new RegExp(req.query.value, "i"),
        }).select("title description");
    }
    query.exec((err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});

router.post("/", auth, (req, res) => {
    const newLog = new Log(req.body);
    newLog.save({}, (err, log) => {
        if (err) console.error(err);
        res.json(log);
    });
});

router.post("/scan", auth, (req, res) => {
    var basePath = process.env.MEDIA_ROOT;
    if (!req.body.path)
        res.status(400).json({ errors: [{ msg: "Missing Path" }] });
    var sanitizedPath = path
        .normalize(req.body.path)
        .replace(/^(\.\.(\/|\\|$))+/, "");
    var search = path.join(basePath, sanitizedPath);
    var rfiles = [];
    fs.readdir(search, { withFileTypes: true }, (err, files) => {
        if (err) res.status(500).json({ errors: [{ msg: err }] });
        else if (files === undefined) res.json([]);
        else {
            files.forEach((file) => {
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
    var query;
    if (req.query.type) {
        if (req.header("x-auth-token")) {
            auth(req, res, () => {
                query = Log.findById(req.params.id);
            });
        } else {
            query = Log.findById(req.params.id).select(
                "title description completed date_of_completion"
            );
        }
    } else {
        if (req.header("x-auth-token")) {
            auth(req, res, () => {
                query = OldLog.findById(req.params.id);
            });
        } else {
            query = OldLog.findById(req.params.id).select(
                "title description completed date_of_completion"
            );
        }
    }
    query.exec((err, data) => {
        if (err) console.error(err);
        res.json(data);
    });
});

module.exports = router;
