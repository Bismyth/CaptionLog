const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const ip = require("ip");
const { checkSchema, validationResult } = require("express-validator");
const cas = require("../CAS");
//Import Environment Variables
require("dotenv").config();

//User Model
const User = require("../models/User");

const UserRoles = require("../models/UserRoles");
//@route POST api/auth
//@desc  Auth User
//@access Public
const validator = {
    username: {
        exists: {
            errorMessage: "Please provide username",
        },
        escape: true,
    },
    password: {
        exists: {
            errorMessage: "Please provide password",
        },
    },
};
router.post("/", checkSchema(validator), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const { username, password } = req.body;

    User.findOne({ username }).then((user) => {
        if (!user) return res.status(400).json({ errors: [{ msg: "User does not exists" }] });

        //Compare Hashed Password
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) return res.status(400).json({ errors: [{ msg: "Invaid Password" }] });
            jwt.sign(
                { id: user.id, access: user.access },
                process.env.JWT_SECRET,
                {
                    expiresIn: 43200,
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

//@route GET api/auth/user
//@desc  Authenticate User and return data
//@access Private
router.get("/user", auth.block(), (req, res) => {
    const { cn, displayname, givenname, sn, departmentnumber } = req.session.user;
    res.json({
        cn,
        displayname,
        givenname,
        sn,
        departmentnumber,
        roles: req.roles,
    });
});

router.get("/local", (req, res) => {
    res.json({
        local:
            process.env.SUBNET.split(",").some((v) => {
                return ip.cidrSubnet(v).contains(req.clientIp);
            }) || ip.isLoopback(req.clientIp),
    });
});

router.get("/roles", auth.block(auth.roles.admin), (req, res) => {
    UserRoles.find((err, doc) => {
        if (err) return res.sendStatus(500);
        res.json(doc);
    });
});

router.post("/roles", auth.block(auth.roles.admin), (req, res) => {
    var { doeNumber, adGroup, roles } = req.body;
    if (roles.admin) {
        roles = Object.fromEntries(
            Object.entries(auth.roles).map((v) => {
                return [v[0], true];
            })
        );
    }
    const newRoles = new UserRoles({
        doeNumber,
        adGroup,
        roles,
    });
    newRoles.save((err, doc) => {
        if (err) return res.sendStatus(500);
        res.json(doc);
    });
});

router.put("/roles", auth.block(auth.roles.admin), (req, res) => {
    var { doeNumber, adGroup, roles, _id: id } = req.body;
    if (roles.admin) {
        roles = Object.fromEntries(
            Object.entries(auth.roles).map((v) => {
                return [v[0], true];
            })
        );
    }
    var body = {
        doeNumber,
        adGroup,
        roles,
    };
    UserRoles.findByIdAndUpdate(id, body, (err, doc) => {
        if (err) return res.sendStatus(500);
        res.json(doc);
    });
});

router.delete("/roles", auth.block(auth.roles.admin), (req, res) => {
    UserRoles.findByIdAndDelete(req.body.id, (err, doc) => {
        if (err) res.sendStatus(500);
        res.json(doc);
    });
});

module.exports = router;
