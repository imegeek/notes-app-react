// getting-started.js
const mongoose = require('mongoose');

const connectToMongoDB = async () => {
	await mongoose.connect('mongodb://127.0.0.1:27017/notes');

	// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

connectToMongoDB()
.then(() => {
	console.log("Connected successfully to MongoDB server")
})
.catch(err => console.log(err));

module.exports = connectToMongoDB
