import React, { Component } from 'react';
import { BrowserRouter } from "react-router-dom"
import './App.css';
import RouterComponent from './router/index';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <RouterComponent />
      </BrowserRouter>
    );
  }
}

export default App;
