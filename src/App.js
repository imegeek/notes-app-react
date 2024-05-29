import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccountState from './context/AccountContext';
import NoteState from './context/NoteContext';
import Navbar from './components/Navbar';
import Account from './components/Account';
import NotFound from './components/NotFound';
import Notes from './components/Notes';
import './App.css';

export default class App extends Component {
  state = {
    logged: null
  }

  setLogin = async (value) => {
    this.setState({
      logged: value
    })
  }

  render() {
    return (
      <AccountState>
        <NoteState>
        <Router>
          <Navbar logged={this.state.logged} />
          <Routes>
              <Route path="/account/*" element={<Account login={this.setLogin} />} />
              <Route path="/" element={<Notes logged={this.state.logged} />} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </Router>
        </NoteState>
      </AccountState>
    );
  }
}

