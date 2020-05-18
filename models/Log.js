const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DigitalInfoSchema = new Schema({
	name: { type: String },
	length: { type: String },
	location: { type: String },
	clickviewUrl: { type: String },
});

const CopyrightInfoSchema = new Schema({
	teacherName: { type: String },
	captionSource: { type: String },
	videoSouce: { type: String },
	originalLocation: { type: String },
});

const PhysicalMediaSchema = new Schema({
	name: { type: String },
	location: { type: String },
	copiesHeld: { type: Number },
	onLoan: { type: String },
});

const LogSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	year: {
		type: Number,
	},
	description: {
		type: String,
	},
	genre: {
		type: String,
	},
	dateOfCompletion: {
		type: Date,
		required: true,
	},
	copyrigtInfo: CopyrightInfoSchema,
	digitalInfo: [DigitalInfoSchema],
	physicalInfo: [PhysicalMediaSchema],
});

module.exports = Log = mongoose.model("log", LogSchema);
