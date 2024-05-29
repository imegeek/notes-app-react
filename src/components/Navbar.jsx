import { NoteContext } from '../context/NoteContext'
import React, { Component } from 'react'
import * as FaIcons from "react-icons/fa"
import * as FaIcons6 from "react-icons/fa6"
import { NavLink } from "react-router-dom"
import icon from '../icon.png'
import './css/Navbar.css'

export default class Navbar extends Component {
	static contextType = NoteContext;

	constructor(props) {
		super(props);
		this.state = {
			sideBarState: false,
			searchQuery: ""
		}

		this.dropdown = React.createRef()
	}

	handleMenuBar = (event) => {
		this.setState({
			sideBarState: !this.state.sideBarState
		})
	}

	handleDropdown = () => {
		this.dropdown.current.classList.toggle("open-dropdown")
	}

	render() {
		return (
			<div className='navbar'>
				{/* <div className={`side-bar ${this.state.sideBarState ? "active" : ""}`}>
					<div className="items">
						
					</div>
				</div> */}
				<div className="left-utility">
					{/* <FaIcons.FaBars className='menu-bar' onClick={this.handleMenuBar}/> */}
					<div className="logo">
						<img src={icon} alt="" />
					</div>
					<div className="title">Notes</div>
				</div>

				<div className="right-utility">
					{
						this.context.token && (
							<div className="input-box">
								<FaIcons.FaSearch className='search-icon' />
								<input type="text" onChange={this.context.search} />
							</div>
						)
					}

					{
						(!this.context.token) ?
							<NavLink className="login" to="/account/login">Sign in</NavLink>
							:
							<>
								<div className="profile" onClick={this.handleDropdown} >
									<FaIcons.FaUser className='user' />
								</div>
								<div className='dropdown' ref={this.dropdown}>
									<FaIcons6.FaXmark className='close-btn' onClick={this.handleDropdown} />
									<div className="content">
										<p className="email">{this.context.done && this.context.user.email}</p>
										<span>
											<FaIcons.FaUser className='user-m' />
										</span>
										<p className="name">Hi, {this.context.done && this.context.user.name.split(" ")[0]}!</p>

										<div onClick={() => this.context.logout()} className="signout">
											Sign Out
										</div>
									</div>
								</div>
							</>
					}

				</div>
			</div>
		)
	}
}
