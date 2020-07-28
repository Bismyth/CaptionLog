const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const accessLevels = require("./AccessLevel");
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    access: {
        type: String,
        enum: accessLevels,
        required: true,
    },
});

module.exports = User = mongoose.model("user", UserSchema);
