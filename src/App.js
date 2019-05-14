import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import {init,animate,setColor,setBackgroundColor} from './Three/script.js'
import {ThemeContext, themes} from './theme-context';
import ThemedButton from './themed-button';
// import ThemedDiv from './themed-testing';

function Toolbar(props) {
  return (
    <div className="themeButton">
      <div className="themeText">Try this!</div>
      <label className="switch">
        <input type="checkbox" onChange={props.changeTheme}/>
        <span className="slider round"></span>
      </label>
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "yellow",
      disabled: false,
      theme: themes.dark,
    };
    this.selectColor = this.selectColor.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
  };



  toggleTheme(event) {
    var background = this.state.theme === themes.dark ? "#ecebeb":"#1e3959"
    setBackgroundColor(background)
    this.setState(state => ({
      theme: state.theme === themes.dark ? themes.light : themes.dark,
    }));
  };

  selectColor(event) {
    var newColor = event.target.className.split(' ')[1]
    if (!newColor) return
    this.setState({
      color: newColor
    });
    setColor(newColor)
    if (newColor) {
      document.querySelector('.paletteContainer>.selected').classList.remove("selected")
      event.target.classList.add("selected");
    }
  }
  onMouseEnter(event) {
    this.setState({
      disabled: true,
    });
  }
  onMouseLeave(event) {
    this.setState({
      disabled: false,
    });
  }
	componentDidMount() {
		init();
		animate();
	}
  render() {
    return (
      <div className="App">
      <ThemeContext.Provider value={this.state.theme}>
        <div className="Toolbar">
          <div className="logo">
            <img className='logoimg' src={process.env.PUBLIC_URL + '/lego_name.png'} />
          </div>          
          <Toolbar changeTheme={this.toggleTheme} />
        </div>
        <div className="Store" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{backgroundColor: this.state.theme.storeColor}}>
          <p>Color</p>
          <div className="paletteContainer">
            <div className="palette yellow selected" onClick={this.selectColor} style={{borderColor: this.state.theme.storeColor}}></div>
            <div className="palette red" onClick={this.selectColor} style={{borderColor: this.state.theme.storeColor}}></div>
            <div className="palette orange" onClick={this.selectColor} style={{borderColor: this.state.theme.storeColor}}></div>
            <div className="palette green" onClick={this.selectColor} style={{borderColor: this.state.theme.storeColor}}></div>
            <div className="palette blue" onClick={this.selectColor}  style={{borderColor: this.state.theme.storeColor}}></div>
          </div>
         
        </div>
          
        <div className="World"></div>
        </ThemeContext.Provider>
      </div>
    );
  }
}

export default App;