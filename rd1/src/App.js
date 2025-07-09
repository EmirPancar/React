import logo from './logo.svg';
import './App.css';
import Cmp1 from './comp1';
import React, { useState } from 'react';



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


  const [yeniCesit, setYeniCesit] = useState('');
  const [yeniFiyat, setYeniFiyat] = useState('');

  const kahve_ekle = () => {

    if (yeniCesit.trim() === '' || isNaN(parseFloat(yeniFiyat))) {
      alert("Geçerli bir çeşit ve fiyat giriniz.");
      return;
    }

    setUrunler(prev => [
      ...prev,
      {
        cesit: yeniCesit,
        fiyat: parseFloat(yeniFiyat)
      }
    ]);

    
    setYeniCesit('');
    setYeniFiyat('');
  };

  return (
    <div>
      <Cmp1 urunler={urunler} />

      
      <div>
        <input
          className="KahveInput"
          type="text"
          placeholder="Kahve çeşidi"
          value={yeniCesit}
          onChange={(e) => setYeniCesit(e.target.value)}
        />

        <input
          className="KahveInput"
          type="text"
          placeholder="Fiyat"
          value={yeniFiyat}
          onChange={(e) => setYeniFiyat(e.target.value)}
        />
        <button onClick={kahve_ekle} className="AddButton">Ekle</button>
      </div>
    </div>
  );
}

export default App;
