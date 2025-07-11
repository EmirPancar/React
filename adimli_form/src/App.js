import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Navigation from './Navigation';
import React, { useState } from 'react';

function App() {

  return (
    <div className='Container'>
      <Header />
      <Navigation/>
    </div>
  );
}

export default App;
