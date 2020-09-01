const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const fs = require("fs");
const path = require("path");
const { checkSchema, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const junk = require("junk");
var ffprobe = require("ffprobe"),
    ffprobeStatic = require("ffprobe-static");
const { Types } = require("mongoose");
//Import Environment Variables
require("dotenv").config();

//Importing old Model s
const { OldLog, Update } = require("../models/OldLog");
const Log = require("../models/Log");
const processVideoLength = async (digitalInfo) => {
    for (let index = 0; index < digitalInfo.length; index++) {
        var v = digitalInfo[index];
        if (v.location) {
            const video = path.join(process.env.MEDIA_ROOT, v.location);
            if (fs.existsSync(video)) {
                if (v.length === "") {
                    var videoInfo;
                    try {
                        videoInfo = await ffprobe(video, { path: ffprobeStatic.path });
                    } catch (err) {
                        console.error(err);
                    }

                    const seconds = videoInfo.streams[0].duration;
                    var measuredTime = new Date(null);
                    measuredTime.setSeconds(seconds);
                    if (seconds < 3600) {
                        v.length = measuredTime.toISOString().substr(14, 5);
                    } else {
                        v.length = measuredTime.toISOString().substr(11, 8);
                    }
                }
            }
        }
    }
};

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
    Promise.all([query, queryO])
        .then((results) => {
            var joined = [
                ...results[0],
                ...results[1].map((value) => {
                    return { ...value, old: true };
                }),
            ];
            res.json(joined.sort((a, b) => (a.title > b.title ? 1 : -1)));
        })
        .catch((err) => {
            res.sendStatus(500);
        });
});

router.get("/search", auth.read, (req, res) => {
    console.log(req.body);
    var queryO = OldLog.find({ title: { $regex: req.query.value, $options: "i" } })
        .select("title description")
        .lean();
    Promise.all([queryO])
        .then((results) => {
            var joined = [...results[0]];
            res.json(results);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

router.post(
    "/",
    checkSchema(require("../validationSchema/newLog")),
    auth.block(auth.roles.write),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
        try {
            await processVideoLength(req.body.digitalInfo);
        } catch (e) {
            return res.status(500);
        }

        const newLog = new Log(req.body);
        newLog.save((err, doc) => {
            if (err) return res.sendStatus(500);
            res.json(doc);
        });
    }
);

router.post(
    "/convert",
    checkSchema(require("../validationSchema/newLog")),
    auth.block(auth.roles.write),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
        try {
            await processVideoLength(req.body.digitalInfo);
        } catch (e) {
            return res.status(500);
        }
        const { _id: oldID, ...data } = req.body;
        const newLog = new Log(data);
        newLog.save((err, doc) => {
            if (err) return res.sendStatus(500);
            OldLog.findById(oldID, (oErr, oDoc) => {
                if (oErr) return res.sendStatus(500);
                const newUpdate = new Update({
                    newLog: { id: doc._id, title: doc.title },
                    oldLog: oDoc,
                });
                newUpdate.save(() => {
                    OldLog.findByIdAndDelete(oldID, () => {
                        res.json(doc);
                    });
                });
            });
        });
    }
);

router.put(
    "/",
    checkSchema(require("../validationSchema/newLog")),
    auth.block(auth.roles.write),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
        try {
            await processVideoLength(req.body.digitalInfo);
        } catch (e) {
            return res.status(500);
        }
        const { _id: id, ...data } = req.body;
        Log.findByIdAndUpdate(id, data, (err, doc) => {
            if (err) return res.sendStatus(500);
            res.json(doc);
        });
    }
);

router.post("/scan", auth.block(auth.roles.read), (req, res) => {
    var basePath = process.env.MEDIA_ROOT;
    if (!req.body.path) res.status(400).json({ errors: [{ msg: "Missing Path" }] });
    var sanitizedPath = path.normalize(req.body.path).replace(/^(\.\.(\/|\\|$))+/, "");
    var search = path.join(basePath, sanitizedPath);
    var rfiles = [];
    fs.readdir(search, { withFileTypes: true }, (err, files) => {
        if (err) res.status(500).json({ errors: [{ msg: err }] });
        else if (files === undefined) res.json([]);
        else {
            files
                .filter((v) => {
                    return junk.not(v.name);
                })
                .forEach((file) => {
                    rfiles.push({
                        id: path.join(sanitizedPath, file.name),
                        name: file.name,
                        isDir: file.isDirectory(),
                    });
                });
            res.json(rfiles.sort((a, b) => +b.isDir - +a.isDir || a.name.localeCompare(b.name)));
        }
    });
});

//@route GET api/logs/:id
//@desc  Return Specific Log
//@access Public but more info is private
router.get("/:id", auth.read, (req, res) => {
    var Source;
    if (req.query.type === "old") Source = OldLog;
    else Source = Log;
    if (req.roles && req.roles[auth.roles.read]) {
        Source.findById(req.params.id, (err, doc) => {
            if (err) return res.sendStatus(500);
            Update.findOne({ "newLog.id": Types.ObjectId(req.params.id) }, (oErr, oDoc) => {
                if (oDoc !== null) res.json({ ...doc, oData: oDoc.oldLog });
                else res.json(doc);
            }).lean();
        }).lean();
    } else {
        Source.findById(req.params.id, (err, data) => {
            if (err) return res.sendStatus(500);
            res.json(data);
        }).select(
            req.query.type === "old"
                ? "title description genre"
                : "title description genre movieInfo digitalInfo physicalInfo"
        );
    }
});

router.delete("/:id", auth.block(auth.roles.write), (req, res) => {
    var Source;
    if (req.body.old) Source = OldLog;
    else Source = Log;
    Source.findByIdAndDelete(req.params.id, (err, doc) => {
        if (err) return res.sendStatus(500);
        res.json({ msg: "Delete Sucessful" });
    });
});

module.exports = router;
