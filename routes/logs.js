const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//Import Environment Variables
require("dotenv").config();

//User Model
const OldLog = require("../models/OldLog");
//@route GET api/logs
//@desc  Return Logs
//@access Public
router.get("/", (req, res) => {
	var query = OldLog.find(req.query.search)
		.select("title description date_of_completion")
		.sort("-date_of_completion");
	query.exec((err, data) => {
		if (err) console.error(err);
		res.json(data);
	});
});

router.get("/:id", auth, (req, res) => {
	OldLog.findById(req.params.id, (err, data) => {
		if (err) console.error(err);
		res.json(data);
	});
});

module.exports = router;
