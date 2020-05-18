const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UpdateSchema = new Schema({
	oldLog: {
		type: mongoose.ObjectId,
		required: true,
	},
});

module.exports = Update = mongoose.model("update", UpdateSchema);
