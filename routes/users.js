const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

//Import Environment Variables
require("dotenv").config({ path: "../" });

//User Model
const User = require("../models/User");

//@route POST api/users
//@desc  Register new user
//@acess Public
router.post("/", (req, res) => {
	const { username, password, access } = req.body;
	//Simple Validation
	if (!username || !password || !access)
		return res.status(400).json({ msg: "Please enter all fields" });

	User.findOne({ username }).then((user) => {
		if (user) return res.status(400).json({ msg: "User Exists" });

		const newUser = new User({
			username,
			password,
			access,
		});

		//Create Salt and Hash
		bcrypt.genSalt(10, (err, salt) => {
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
});

module.exports = router;
