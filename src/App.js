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
        <div className="Toolbar">
          <div className="logo">
            <img className='logoimg' src={process.env.PUBLIC_URL + '/lego.png'}/>
          </div>
          <div className='appName'>| oLo</div>
        </div>
        <div className="World"></div>
      </div>
    );
  }
}

export default App;
