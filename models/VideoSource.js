const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSourceSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
});

module.exports = VideoSource = mongoose.model("videosource", VideoSourceSchema);
