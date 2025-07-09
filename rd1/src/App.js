import logo from './logo.svg';
import './App.css';
import Cmp1 from './comp1';
import React from 'react';

const urunler=[
    {
      cesit:"Mocha",
      fiyat:120
    },
    {
      cesit:"Espresso",
      fiyat:140
    },
     {
      cesit:"Iced Coffe",
      fiyat:100
    },
     {
      cesit:"Cappucino",
      fiyat:135
    }

]



function App() {


  return (
    <div>
      <Cmp1 urunler={urunler}/>
    </div>
  );
}

export default App;
