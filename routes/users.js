const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { checkSchema, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

//Import Environment Variables
require("dotenv").config({ path: "../" });

//User Model
const User = require("../models/User");
const accessLevels = require("../models/AccessLevel");
//@route POST api/users
//@desc  Register new user
//@acess Public
const validator = {
    username: {
        exists: {
            errorMessage: "Please provide username",
        },
        custom: {
            options: (username) => {
                return User.findOne({ username }).then((user) => {
                    if (user) return Promise.reject("Username already in use");
                });
            },
        },
        escape: true,
    },
    password: {
        exists: {
            errorMessage: "Please provide password",
        },
    },
    access: {
        exists: {
            errorMessage: "Please provide access level",
        },
        isIn: {
            options: accessLevels,
            errorMessage: "Please input valid access level",
        },
        escape: true,
    },
};
router.post("/", checkSchema(validator), auth, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
    const { username, password, access } = req.body;

    const newUser = new User({
        username,
        password,
        access,
    });
    //Create Salt and hash
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then((user) => {
                jwt.sign(
                    { id: user.id, access: user.access },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: 3600,
                    },
                    (err, token) => {
                        if (err) throw err;
                        res.json({
                            token,
                            user: {
                                id: user._id,
                                username: user.username,
                                access: user.access,
                            },
                        });
                    }
                );
            });
        });
    });
});

module.exports = router;
