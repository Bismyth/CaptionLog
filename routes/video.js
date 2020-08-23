const express = require("express");
const router = express.Router();
const Log = require("../models/Log");
const { Types } = require("mongoose");
const { checkSchema, validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const local = require("../middleware/local");

//Import Environment Variables
require("dotenv").config();

const videoIDs = {
    id: {
        exists: true,
        errorMessage: "Provide Valid ID",
        in: ["params"],
        custom: {
            options: (value) => {
                if (!Types.ObjectId.isValid(value)) throw new Error("ID is invalid");
                return true;
            },
        },
    },
    vid: {
        exists: true,
        errorMessage: "Provide Valid Video ID",
        in: ["params"],
        custom: {
            options: (value) => {
                if (!Types.ObjectId.isValid(value)) throw new Error("VID is invalid");
                return true;
            },
        },
    },
};

router.get("/:id/:vid", local, checkSchema(videoIDs), function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    Log.findById(req.params.id, (err, doc) => {
        if (err) {
            console.error(err);
            return res.status(400).json(err);
        }
        const video = doc.digitalInfo.filter((v) => {
            return v._id.equals(Types.ObjectId(req.params.vid));
        })[0];
        if (!video) return res.status(400).json({ msg: "No Video found" });
        const vpath = path.join(process.env.MEDIA_ROOT, video.location);
        if (!fs.existsSync(vpath)) return res.status(400).json({ msg: "No Video found" });
        const stat = fs.statSync(vpath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            const chunksize = end - start + 1;
            const file = fs.createReadStream(vpath, { start, end });
            const head = {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4",
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                "Content-Length": fileSize,
                "Content-Type": "video/mp4",
            };
            res.writeHead(200, head);
            fs.createReadStream(vpath).pipe(res);
        }
    });
});

module.exports = router;
