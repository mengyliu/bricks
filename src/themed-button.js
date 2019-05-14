import React from 'react';
import {ThemeContext} from './theme-context';

class ThemedButton extends React.Component {
  render() {
    let props = this.props;
    let theme = this.context;
    return (
      <label className="switch">
        <input type="checkbox" />
        <span className="slider round"></span>
      </label>
    );
  }
}
ThemedButton.contextType = ThemeContext;

export default ThemedButton;