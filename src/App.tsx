import React from 'react';
import './App.css';
import Engine from './engine'
import {CountProvider} from "./engine/context/ConfigurationProvider";

function App() {
  return (
    <div className="App">
        <CountProvider>
          <Engine />
        </CountProvider>
    </div>
  );
}

export default App;
