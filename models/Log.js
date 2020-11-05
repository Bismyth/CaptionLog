const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DigitalInfoSchema = new Schema({
    name: String,
    description: String,
    length: String,
    location: String,
    externalLink: String,
    subtitle: String,
    year: Number,
    rating: String,
    captionSource: String,
    videoSource: String,
    dateOfCompletion: String,
    originalLocation: String,
    isPrivate: Boolean,
});

const LogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    genre: String,
    folder: String,
    year: Number,
    rating: String,
    teacherName: String,
    captionSource: String,
    videoSource: String,
    dateOfCompletion: String,
    originalLocation: String,
    isPrivate: Boolean,
    digitalInfo: [DigitalInfoSchema],
});

LogSchema.index(
    { title: "text", description: "text" },
    { name: "Search", weights: { title: 20, description: 1 } }
);

module.exports = Log = mongoose.model("log", LogSchema);
