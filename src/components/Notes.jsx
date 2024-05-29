import { NoteContext } from '../context/NoteContext'
import { useLocation, useNavigate } from 'react-router-dom';
import React, { Component } from 'react'
import ItemBox from './ItemBox';
import './css/Notes.css'

function withHooks(Component) {
	return props => <Component {...props} navigate={useNavigate()} location={useLocation()} />;
}

class Notes extends Component {
	static contextType = NoteContext;

	constructor(props) {
		super(props);
		this.state = {
			openEditModal: false,
			expandInputBox: false,
			noteIndex: 0,
			note: {
				title: "",
				description: "",
				tag: "General"
			}
		}

		this.addNote = React.createRef()
		this.editModal = React.createRef()
	}

	handleChangeUpdate = (key, value) => {
		const update = { ...this.context.user, key: value };
		this.context.update(update);
	};

	handleAddInput = (event) => {
		this.setState({
			expandInputBox: true
		})
	}

	onChange = async (event) => {
		await this.setState({
			note: {
				...this.state.note, [event.target.name]: event.target.value
			}
		})
	}

	resetInput = (ref) => {
		let elements = ref.current.querySelectorAll("input")
		elements.forEach(input => {
			input.value = ""
		});
	}

	handleAddNote = async (event) => {
		this.setState({
			expandInputBox: false
		})
		await this.context.add(this.state.note)

		this.resetInput(this.addNote)
	}

	handleEditNote = (note) => {
		this.editModal.current.classList.add("open")
		this.setState({
			note: note
		})
	}

	handleUpdateNote = async () => {
		this.editModal.current.classList.remove("open")
		await this.context.update(this.state.note)

		this.resetInput(this.editModal)
	}

	handleDeleteNote = (id) => {
		this.context.delete(id)
	}

	handleEnterEvent = (event, func) => {
		if (event.key === "Enter") {
			func()
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// console.log(this.context.notes);
		if (!this.context.token) {
			this.props.navigate("/account/login")
		}
	}

	render() {
		if (!this.context.done) {
			return null;
		}

		// let filteredNotes = this.context.notes.filter(note =>
		// 	note.title.toLowerCase().includes(this.context.filter.toLowerCase()) // Assuming notes have a 'title' property to search in
		// );

		const filteredNotes = this.context.notes.filter((note) => {
			const query = this.context.filter.toLowerCase();
			const titleMatch = note.title && note.title.toLowerCase().includes(query);
			const descriptionMatch = note.description && note.description.toLowerCase().includes(query);
			return titleMatch || descriptionMatch;
		});

		return (
			<div className='notes'>
				<div onKeyDown={(event) => this.handleEnterEvent(event, this.handleUpdateNote)} className="edit-modal" ref={this.editModal}>
					<div className="edit-content">
						<div className="input-content">
							<input type="text" value={this.state.note.title} name='title' onChange={this.onChange} placeholder='Title' />
							<input type="text" value={this.state.note.description} name='description' onChange={this.onChange} placeholder='Note' />
							<input type="text" value={this.state.note.tag} name='tag' onChange={this.onChange} placeholder='Tag' />
						</div>
						<div className="button-content">
							<button onClick={this.handleUpdateNote}>Save</button>
							<button onClick={() => this.editModal.current.classList.remove("open")}>Close</button>
						</div>
					</div>
				</div>
				<div onKeyDown={(event) => this.handleEnterEvent(event, this.handleAddNote)} className="add-note" ref={this.addNote}>
					<div className="input-box" onClick={this.handleAddInput}>
						<input style={{
							display: `${this.state.expandInputBox ? "block" : "none"}`
						}} type="text" placeholder='Title' name='title' onChange={this.onChange} />
						<input type="text" placeholder='Take a note…' name='description' onChange={this.onChange} />
					</div>
					<div style={{
						display: `${this.state.expandInputBox ? "flex" : "none"}`
					}} className="button-box">
						<button onClick={this.handleAddNote}>Save</button>
						<button onClick={() => this.setState({ expandInputBox: false })}>Close</button>
					</div>
				</div>
				<div className="container">
					{
						(filteredNotes.length > 0) ? filteredNotes.map((note, index) => {
							return <div key={note._id}>
								<ItemBox note={note} update={this.handleEditNote} delete={this.handleDeleteNote} />
							</div>
						})
						:
						<div className='empty'>
							No Notes Available!
						</div>
					}
				</div>
			</div>
		)
	}
}

export default withHooks(Notes)
