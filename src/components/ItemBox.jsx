import React, { Component } from 'react'
import * as FaIcons from "react-icons/fa"
import './css/ItemBox.css'

export default class ItemBox extends Component {

	render() {
		return (
			<div className="itembox">
				<span className="delete" onClick={() => this.props.delete(this.props.note._id)}>
					<FaIcons.FaTrash />
				</span>
				<div className='note' onClick={() => this.props.update(this.props.note)}>
					<div className="title">{this.props.note.title}</div>
					<div className="desc">{this.props.note.description}</div>
				</div>
			</div>
		)
	}
}
