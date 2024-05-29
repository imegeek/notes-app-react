const jwt = require('jsonwebtoken');
const JWT_SECRET = "mysecrectkey091hY2@ui"

const fetchUser = (req, res, next) => {
	// Get the user from the jwt token and add id to the req object.
	const token = req.header("auth-token")
	if (!token) {
		res.status(400).send("The required header 'auth-token' is missing from the request.")
	}

	try {
		const data = jwt.verify(token, JWT_SECRET)
		req.user = data.user.id
		next();
	} catch(error) {
		res.status(401).send({
			error: "Please authenticate using a valid token."
		})
	}
}

module.exports = fetchUser;