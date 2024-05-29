import React, { Component, createContext } from 'react'

const NoteContext = createContext();

export default class NoteState extends Component {
	api = "http://localhost:5000/api";

	state = {
		token: localStorage.getItem("token"),
		user: {},
		filter: "",
		logged: null,
		done: false,
		notes: []
	}

	loggedIn = (token) => {
		this.setState({
			token: token
		})
	}

	loggedOut = () => {
		this.setState({
			token: localStorage.removeItem("token")
		})
	}

	fetchUser = async () => {
		let userUrl = "http://localhost:5000/api/auth/getuser"

		let options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"auth-token": this.state.token
			}
		}

		let response = await fetch(userUrl, options)
		let json = await response.json()
		if (response.status === 200) {
			this.setState({
				user: json
			})

			this.setState({
				logged: true
			})
		}
		else {
			this.setState({
				logged: false
			})
		}
	}

	fetchNotes = async () => {
		this.setState({
			notes: []
		})

		let readUrl = `${this.api}/note/read`
		let options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"auth-token": this.state.token
			}
		}

		let response = await fetch(readUrl, options)
		if (response.status === 200) {
			let notes = await response.json();
			this.setState({
				notes: notes,
				done: true
			})
		}
	}

	async componentDidMount() {
		await this.fetchUser()
		if (this.state.token) {
			this.fetchNotes()
		}
	}

	async componentDidUpdate(prevProps, prevState) {
		if (prevState.token !== this.state.token) {
			await this.fetchUser()
			this.fetchNotes()
		}

		if (prevState.notes !== this.state.notes) {

			if (this.state.token) {
				this.setState({
					notes: this.state.notes.sort((a, b) => new Date(b.date) - new Date(a.date))
				})
			}
		}
	}

	searchNotes = (event) => {
		let value = event.target.value
		this.setState({
			filter: value
		})
	};

	addNote = async (note) => {
		const { title, description, tag } = note
		let addUrl = `${this.api}/note/create`
		let options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"auth-token": this.state.token
			},
			body: JSON.stringify({ title, description, tag })
		}

		await fetch(addUrl, options)
		this.fetchNotes()

		// this.setState({
		// 	notes: this.state.notes.concat(note)
		// })
	}

	updateNote = async (data) => {
		const { _id, title, description, tag } = data
		let updateUrl = `${this.api}/note/update/${_id}`
		let options = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"auth-token": this.state.token
			},
			body: JSON.stringify({ title, description, tag })
		}

		await fetch(updateUrl, options)
		this.fetchNotes()
	}

	deleteNote = async (id) => {
		let deleteUrl = `${this.api}/note/delete/${id}`
		let options = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"auth-token": this.state.token
			}
		}

		await fetch(deleteUrl, options)
		this.fetchNotes()

		// let newNote = this.state.notes.filter(note => {
		// 	return note._id !== id
		// })

		// this.setState({
		// 	notes: newNote
		// })
	}

	render() {
		return (
			// <NoteContext.Provider value={{ ...this.state, update: this.updateContext }} >
			<NoteContext.Provider value={
				{
					...this.state,
					add: this.addNote,
					update: this.updateNote,
					delete: this.deleteNote,
					login: this.loggedIn,
					logout: this.loggedOut,
					search: this.searchNotes
				}
			} >
				{this.props.children}
			</NoteContext.Provider>
		)
	}
}

export { NoteContext, NoteState }
