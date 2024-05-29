import React, { Component, createContext } from 'react'

const AccountContext = createContext();

export default class AccountState extends Component {
	state = {
		user: null
	}

	setUser = (value) => {
		this.setState({
			user: value
		})
	}

	render() {
		return (
			<AccountContext.Provider value={{
				...this.state.user,
				setUser: this.setUser
			}}>
				{this.props.children}
			</AccountContext.Provider>
		)
	}
}

export { AccountContext, AccountState }
