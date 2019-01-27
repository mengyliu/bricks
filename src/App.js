import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {init,animate} from './Three/script.js'

class App extends Component {
	componentDidMount() {
		init();
		animate();
	}
  render() {
    return (
      <div className="App">
      </div>
    );
  }
}

export default App;
