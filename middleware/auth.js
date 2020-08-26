const jwt = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config({ path: "../" });

const auth = (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        //Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Add user from payload
        req.user = decoded;
        User.findOne({ _id: decoded.id }, (err, user) => {
            if (err) res.status(500).json({ msg: "Can't Find User" });
            req.user = user;
            next();
        });
    } catch (e) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};
module.exports = auth;
