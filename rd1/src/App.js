// import logo from './logo.svg';
import './App.css';
import Cmp1 from './comp1';
import React, {useState } from 'react';
import AddCoffee from './AddComp';



function App() {

  

  const [urunler, setUrunler]=useState([
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

])



  return (
    <div>
      <Cmp1 urunler={urunler} />

      <AddCoffee  setUrunler={setUrunler} urunler={urunler}/>

    </div>
  );
}

export default App;
