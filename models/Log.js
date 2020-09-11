const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DigitalInfoSchema = new Schema({
    name: String,
    length: String,
    location: String,
    clickviewUrl: String,
    subtitle: String,
});

const CopyrightInfoSchema = new Schema({
    _id: false,
    teacherName: String,
    captionSource: String,
    videoSource: String,
    dateOfCompletion: {
        type: String,
        required: true,
    },
    originalLocation: String,
});

const PhysicalMediaSchema = new Schema({
    name: String,
    location: String,
    copiesHeld: Number,
    onLoan: String,
});

const MovieInfoSchema = new Schema({
    _id: false,
    year: Number,
    rating: String,
    tag: [String],
});

const LogSchema = new Schema({
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
    folder: {
        type: String,
    },
    movieInfo: MovieInfoSchema,
    copyrightInfo: { type: CopyrightInfoSchema, required: true },
    digitalInfo: [DigitalInfoSchema],
    physicalInfo: [PhysicalMediaSchema],
});

LogSchema.index(
    { title: "text", description: "text" },
    { name: "Search", weights: { title: 20, description: 1 } }
);

module.exports = Log = mongoose.model("log", LogSchema);
