const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes")
const fetchUser = require("../middleware/fetchUser")
const { body, validationResult } = require('express-validator')

// CRUD operations.

const create_validation = [
	body("title", "Title cannot be empty.").notEmpty(),
	body("description", "Description cannot be empty").notEmpty(),
	// body("tag", "Tag cannot be empty.").notEmpty()
]

// Create note of a user using POST "/api/note/create", Login required.
router.post("/create", create_validation, fetchUser, async (req, res) => {

	// If there are errors while validation, return bad request and erros.
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({
			errors: result.array()
		});
	}

	try {
		const { title, description, tag } = req.body

		const note = new Notes({
			user: req.user,
			title,
			description,
			tag
		})

		await note.save()
		res.send(note)

	} catch (error) {
		console.log(error.message);
		res.status(500).send("Internal Server Error")
	}
})

// Read notes of a user using GET "/api/note/read", Login required.
router.get("/read", fetchUser, async (req, res) => {
	try {
		const notes = await Notes.find({ user: req.user })
		res.send(notes)
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Internal Server Error")
	}
})

// Update exiting note of a user using PUT "/api/note/update", Login required.
router.put("/update/:id", fetchUser, async (req, res) => {

	try {
		const { title, description, tag } = req.body

		// Create a newNote Object.
		const newNote = {}
		if (title) { newNote.title = title }
		if (description) { newNote.description = description }
		if (tag) { newNote.tag = tag }
		newNote.date = new Date()

		// Find the note by id and checks the conditions.
		const note = await Notes.findById(req.params.id)
		if (!note) {
			return res.status(404).send("Not found")
		}

		if (note.user.toString() !== req.user) {
			return res.status(401).send("Not allowed")
		}

		// Allow Update the user note, if all conditions are true.
		const updateNote = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
		res.send(updateNote)

	} catch (error) {
		console.log(error.message);
		res.status(500).send("Internal Server Error")
	}
})

// Delete exiting note of a user using DELETE "/api/note/delete", Login required.
router.delete("/delete/:id", fetchUser, async (req, res) => {

	try {
		// Find the note by id and checks the conditions.
		const note = await Notes.findById(req.params.id)
		if (!note) {
			return res.status(404).send("Not found")
		}

		if (note.user.toString() !== req.user) {
			return res.status(401).send("Not allowed")
		}

		// Allow Delete the user note, if all conditions are true.
		const deleteNote = await Notes.findByIdAndDelete(req.params.id)
		res.send({
			message: "Note has been deleted successfully.",
			note: deleteNote
		})

	} catch (error) {
		console.log(error.message);
		res.status(500).send("Internal Server Error")
	}
})

module.exports = router
