const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CaptionSourceSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
});

module.exports = CaptionSource = mongoose.model(
	"captionSource",
	CaptionSourceSchema
);
