import React from 'react';
export const themes = {
  light: {
    background: '#eeeeee',
    storeColor: '#d6d6d6',
  },
  dark: {
    background: '#222222',
    storeColor: '#051326',
  },
};

export const ThemeContext = React.createContext(
  themes.dark // default value
);