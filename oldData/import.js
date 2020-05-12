const mongoose = require("mongoose");

const fs = require("fs");
let rawdata1 = fs.readFileSync("./oldData/caption_sources.json");
let captionsource = JSON.parse(rawdata1);
let rawdata2 = fs.readFileSync("./oldData/genres.json");
let genres = JSON.parse(rawdata2);
let rawdata3 = fs.readFileSync("./oldData/video_sources.json");
let videosources = JSON.parse(rawdata3);
let rawdata4 = fs.readFileSync("./oldData/logs.json");
let rawLog = JSON.parse(rawdata4);

const OldLog = require("../models/OldLog");

require("dotenv").config();

console.log(rawLog[0]);

const getId = (obj, id) => {
	var o = obj.find((xs) => xs.id === id);
	if (o) {
		return o.name;
	} else {
		return null;
	}
};

let imp = [];
rawLog.forEach((e) => {
	imp.push({
		title: e.title,
		description: e.description,
		genre: getId(genres, e.genre_id),
		disks: e.disks,
		length: e.length,
		completed: e.completed == 1,
		date_of_completion: new Date(e.date_of_completion),
		caption_source: getId(captionsource, e.caption_source_id),
		video_source: getId(videosources, e.video_source_id),
		original_copy_location: e.original_copy_location,
		other: e.other,
	});
});

console.log(imp.length);

// mongoose
// 	.connect(process.env.MONGO_URI, {
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 		useCreateIndex: true,
// 	})
// 	.then(() => {
// 		console.log("MongoDB Connected....");
// 		OldLog.insertMany(imp, (err, res) => {
// 			if (err) return console.error(err);
// 			console.log("Done");
// 		});
// 	})
// 	.catch((err) => console.error(err));
