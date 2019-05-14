import React from 'react';
import {ThemeContext} from './theme-context';

class Toolbar extends React.Component {
  render() {
    let props = this.props;
    let theme = this.context;
    return (
      <div className="Toolbar">
          <div className="logo">
            <img className='logoimg' src={process.env.PUBLIC_URL + '/lego_name.png'} />
          </div>
          <label className="switch">
            <input type="checkbox" onChange={props.changeTheme}/>
            <span className="slider round"></span>
          </label>          
          <Toolbar changeTheme={this.toggleTheme} />
          <ThemedDiv className="testing"></ThemedDiv>  
      </div>
    );
  }
}
Toolbar.contextType = ThemeContext;

export default Toolbar;