const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user"
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true,
	},
	tag: {
		type: String,
		default: "General"
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model("notes", NotesSchema)
