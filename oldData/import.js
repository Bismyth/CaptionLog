const mongoose = require("mongoose");

const fs = require("fs");
let rawdata1 = fs.readFileSync("./oldData/caption_sources.json");
let captionsources = JSON.parse(rawdata1);
let rawdata2 = fs.readFileSync("./oldData/genres.json");
let genres = JSON.parse(rawdata2);
let rawdata3 = fs.readFileSync("./oldData/video_sources.json");
let videosources = JSON.parse(rawdata3);
let rawdata4 = fs.readFileSync("./oldData/logs.json");
let logs = JSON.parse(rawdata4);

const OldLog = require("../models/OldLog");
const Genre = require("../models/Genre");
const CaptionSource = require("../models/CaptionSource");
const VideoSource = require("../models/VideoSource");

require("dotenv").config();

videosources.forEach((e) => {
	delete e.id;
});
genres.forEach((e) => {
	delete e.id;
});
captionsources.forEach((e) => {
	delete e.id;
});
logs.forEach((e) => {
	e["date_of_completion"] = new Date(e["date_of_completion"]);
});

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log("MongoDB Connected....");
		OldLog.insertMany(logs, (err, res) => {
			if (err) return console.error(err);
			console.log("Done");
		});
		VideoSource.insertMany(videosources, (err, res) => {
			if (err) return console.error(err);
			console.log("Done");
		});
		CaptionSource.insertMany(captionsources, (err, res) => {
			if (err) return console.error(err);
			console.log("Done");
		});
		Genre.insertMany(genres, (err, res) => {
			if (err) return console.error(err);
			console.log("Done");
		});
	})
	.catch((err) => console.error(err));
