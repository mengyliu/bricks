import React from 'react';
import {ThemeContext} from './theme-context';

class ThemedDiv extends React.Component {
  render() {
    let props = this.props;
    let theme = this.context;
    return (
      <div className="testing"
        {...props}
        style={{backgroundColor: theme.background}}
      />
    );
  }
}
ThemedDiv.contextType = ThemeContext;

export default ThemedDiv;