const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { checkSchema, validationResult } = require("express-validator");

//Import Environment Variables
require("dotenv").config();

//User Model
const User = require("../models/User");
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
	if (!errors.isEmpty())
		return res.status(422).json({ errors: errors.array() });
	const { username, password } = req.body;

	User.findOne({ username }).then((user) => {
		if (!user)
			return res
				.status(400)
				.json({ errors: [{ msg: "User does not exists" }] });

		//Compare Hashed Password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (!isMatch)
				return res
					.status(400)
					.json({ errors: [{ msg: "Invaid Password" }] });
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

//@route GET api/auth/user
//@desc  Authenticate User and return data
//@access Private
router.get("/user", auth, (req, res) => {
	User.findById(req.user.id)
		.select("-password")
		.then((user) => res.json(user));
});

module.exports = router;
