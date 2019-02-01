import React, { Component } from 'react';
import './App.css';
import GoogleMap from "./map/GoogleMap";
import Menu from "./menu/Menu";
import Logo from "./logo/Logo";

class App extends Component {
  render() {
    return (
        <div>
          <Menu />
          <Logo/>
          <GoogleMap center={{lat: 0, lng: 0}} zoom={0} />
        </div>
    );
  }
}

export default App;
