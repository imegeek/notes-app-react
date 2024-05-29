import { NavLink, useLocation, useNavigate } from 'react-router-dom';
// import { AccountContext } from '../context/AccountContext';
import { NoteContext } from '../context/NoteContext'
import React, { Component } from 'react'
import * as FaIcons from "react-icons/fa6";
import NotFound from './NotFound';
import './css/Account.css'

// const AccountWithRouter = (props) => {
//     const navigate = useNavigate();
//     return <Account {...props} navigate={navigate} />;
// };

function withHooks(Component) {
    return props => <Component {...props} navigate={useNavigate()} location={useLocation()} />;
}

class Account extends Component {
    static contextType = NoteContext;

    constructor(props) {
        super(props);
        this.state = {
            location: this.props.location.pathname,
            account: {},
            loading: true,
        }
        this.wrapper = React.createRef()
    }

    async componentDidMount() {
        this.setState({
            loading: false
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location !== this.props.location) {
            // console.log(this.props.location);

            this.setState({
                location: this.props.location.pathname
            })
        }
    }

    switchPage = (value) => {
        if (value) {
            this.wrapper.current.classList.add("active-wrapper")
        } else {
            this.wrapper.current.classList.remove("active-wrapper")
        }
    }

    onChange = async (event) => {
        await this.setState({
            account: {
                ...this.state.account, [event.target.name]: event.target.value
            }
        })
    }

    handleLogin = async (event) => {
        event.preventDefault()
        let { email, password } = this.state.account

        let loginUrl = "http://localhost:5000/api/auth/login"
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password })
        }
        let response = await fetch(loginUrl, options)
        let json = await response.json()
        if (json.success) {
            localStorage.setItem("token", json.authtoken)
            this.context.login(json.authtoken)
            this.props.navigate("/")
            // setTimeout(() => this.props.navigate("/"), 2000)
        } else {
            alert("Invalid credentails.")
        }
    }

    handleRegister = async (event) => {
        event.preventDefault()
        let { name, email, password } = this.state.account

        let registerUrl = "http://localhost:5000/api/auth/register"
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password })
        }
        let response = await fetch(registerUrl, options)
        let json = await response.json()
        if (json.success) {
            localStorage.setItem("token", json.authtoken)
            this.context.login(json.authtoken)
            this.props.navigate("/")
        }
    }

    renderLogin = () => {
        return (
            <div className="form-box login">
                <form onSubmit={this.handleLogin}>
                    <h1>Sign in</h1>
                    <div className="input-box">
                        <FaIcons.FaUser className='icon-y' />
                        <input type="email" name="email" onChange={this.onChange} placeholder='Email' required />
                    </div>
                    <div className="input-box">
                        <FaIcons.FaLock className='icon-y' />
                        <input type="password" name="password" onChange={this.onChange} placeholder='Password' required />
                    </div>

                    <button className='button' type='submit'>Login</button>
                    <div className="link">
                        <p>Don't have an account? <NavLink to="/account/register" onClick={() => this.switchPage(true)} >Register</NavLink></p>
                    </div>
                </form>
            </div>
        )
    }

    renderRegister = () => {
        return (
            <div className="form-box register">
                <form onSubmit={this.handleRegister}>
                    <h1>Sign up</h1>
                    <div className="input-box">
                        <FaIcons.FaUser className='icon-y' />
                        <input type="text" name="name" onChange={this.onChange} placeholder='Full name' />
                    </div>
                    <div className="input-box">
                        <FaIcons.FaEnvelope className='icon-y' />
                        <input type="email" name="email" onChange={this.onChange} placeholder='Email' required />
                    </div>
                    <div className="input-box">
                        <FaIcons.FaLock className='icon-y' />
                        <input type="password" name="password" onChange={this.onChange} placeholder='Password' required />
                    </div>

                    <button className='button' type='submit'>Register</button>
                    <div className="link">
                        <p>Already have an account? <NavLink to="/account/login" onClick={() => this.switchPage(false)}>Login</NavLink></p>
                    </div>
                </form>
            </div>
        )
    }

    render() {
        if (this.state.loading) {
            return
        }

        if (! ["/account/login", "/account/register"].includes(this.state.location)) {
            return(
                <NotFound/>
            )
        }

        const isActive = this.props.location.pathname === '/account/register';

        return (
            <div className='account'>
                <div className={`account-wrapper ${isActive ? "active-wrapper" : ""}`} ref={this.wrapper}>
                    {this.renderLogin()}
                    {this.renderRegister()}
                </div>
            </div>
        )
    }
}

export default withHooks(Account)

