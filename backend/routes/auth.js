const express = require("express");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/User")
const fetchUser = require("../middleware/fetchUser")
const { body, validationResult } = require('express-validator')
// const { body, query, validationResult } = require('express-validator')

const JWT_SECRET = "mysecrectkey091hY2@ui"

const create_validation = [
	body("name", "Name cannot be empty.").notEmpty(),
	body("name", "Name atleast 3 characters.").isLength({ min: 3 }),
	body("email", "Enter a valid email.").isEmail(),
	body("password", "Password must be atleast 6 characters.").isLength({ min: 6 })
]

// Create a user using POST "/api/auth/createuser". No login required.
router.post("/register", create_validation, async (req, res) => {

	// If there are errors while validation, return bad request and erros.
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({
			errors: result.array()
		});
	}

	try {
		// const user = User(req.body).save()

		// Find an user from database with email
		let findUser = await User.findOne({email: req.body.email})

		// Send status code and error, if user is found with specified email.
		if (findUser) {
			return res.status(400).send({
				success: false,
				error: "User with this email already exists."
			})
		}

		// Adding hash and salt to the password
		const salt = await bcrypt.genSalt(10);
		const passHash = await bcrypt.hash(req.body.password, salt)

		// Create a user to the database.
		const user = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: passHash
		})

		const data = {
			user: {
				id: user.id
			}
		}

		const authtoken = jwt.sign(data, JWT_SECRET)
		res.json({
			success: true,
			authtoken
		})

		// res.send(
		// 	{
		// 		status: "User has been created."
		// 	}
		// )

		// console.log(user);
	}

	// Check if user throw an error
	catch (error) {
		console.log(error.message);
		res.status(500).send("Internal Server Error")
		// res.json({
		// 	error: {
		// 		keyValue: error.errorResponse.keyValue,
		// 		// errmsg: error.errorResponse.errmsg
		// 	}
		// }
		// )
	}
})

const login_validation = [
	body("email", "Enter a valid email.").isEmail(),
	body("password", "Password must be atleast 6 characters.").isLength({ min: 6 })
]

// Authenticate a user using POST "/api/auth/login". no login required.
router.post('/login', login_validation, async (req, res) => {

	// If there are errors while validation, return bad request and erros.
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({
			errors: result.array()
		});
	}

	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email })
		if (!user) {
			return res.status(400).json({
				success: false,
				error: "Please login with correct credentials."
			})
		}

		const comparePassword = await bcrypt.compare(password, user.password)
		if (!comparePassword) {
			return res.status(400).json({
				success: false,
				error: "Please login with correct credentials."
			})
		}

		const data = {
			user: {
				id: user.id
			}
		}

		const authtoken = jwt.sign(data, JWT_SECRET)
		res.json({
			success: true,
			authtoken
		})

	}
	// Check if user throw an error
	catch (error) {
		console.log(error.message);
		res.status(500).send("Internal Server Error")
	}

})

// Get logged in user details using POST "/api/auth/getuser". login required.
router.post('/getuser', fetchUser, async (req, res) => {

	try {
		const user = await User.findById(req.user).select("-password");
		res.json(user)

	} catch (error) {
		console.log(error);
	}
})

module.exports = router
