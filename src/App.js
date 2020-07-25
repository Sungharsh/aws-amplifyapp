import React from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://sungharsh.github.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Notes App
        </a>
      </header>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
