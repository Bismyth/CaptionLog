const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const accessLevels = require("./AccessLevel");

const Roles = new Schema({
    _id: false,
    admin: Boolean,
    read: Boolean,
    write: Boolean,
});

const UserRolesSchema = new Schema({
    doeNumber: {
        type: String,
    },
    adGroup: {
        type: String,
    },
    roles: Roles,
});

module.exports = UserRoles = mongoose.model("userroles", UserRolesSchema);
