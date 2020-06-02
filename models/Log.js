const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DigitalInfoSchema = new Schema({
    name: String,
    length: String,
    location: String,
    clickviewUrl: String,
});

const CopyrightInfoSchema = new Schema({
    teacherName: String,
    captionSource: String,
    videoSouce: String,
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
    year: Number,
    rating: String,
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
    movieInfo: MovieInfoSchema,
    copyrightInfo: { type: CopyrightInfoSchema, required: true },
    digitalInfo: [DigitalInfoSchema],
    physicalInfo: [PhysicalMediaSchema],
});

module.exports = Log = mongoose.model("log", LogSchema);
