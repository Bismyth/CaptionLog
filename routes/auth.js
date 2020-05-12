const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

//Import Environment Variables
require("dotenv").config();

//User Model
const User = require("../models/User");
//@route POST api/auth
//@desc  Auth User
//@acess Public
router.post("/", (req, res) => {
	const { username, password } = req.body;
	//Simple Validation
	if (!username || !password)
		return res.status(400).json({ msg: "Please enter all fields" });

	User.findOne({ username }).then((user) => {
		if (!user) return res.status(400).json({ msg: "User does not exists" });

		//Compare Hashed Password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (!isMatch)
				return res.status(400).json({ msg: "Invalid Password" });
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
//@desc  Get user data
//@acess Private
router.get("/user", auth, (req, res) => {
	User.findById(req.user.id)
		.select("-password")
		.then((user) => res.json(user));
});

module.exports = router;
