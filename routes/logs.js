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
router.get("/view/:id", auth, (req, res) => {
	OldLog.findById(req.params.id, (err, data) => {
		if (err) console.error(err);
		res.json(data);
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
