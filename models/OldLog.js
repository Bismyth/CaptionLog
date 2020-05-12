const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OldLogSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	genre: {
		type: String,
	},
	disks: {
		type: Number,
		required: true,
	},
	length: {
		type: String,
		required: true,
	},
	completed: {
		type: Boolean,
		required: true,
	},
	date_of_completion: {
		type: Date,
		required: true,
	},
	caption_source: {
		type: String,
	},
	video_source: {
		type: String,
		required: true,
	},
	original_copy_location: {
		type: String,
	},
	other: {
		type: String,
		required: true,
	},
});

module.exports = OldLog = mongoose.model("oldlog", OldLogSchema);
