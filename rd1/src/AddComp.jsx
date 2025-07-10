import React, {useEffect, useState } from 'react';

function AddCoffee({urunler,setUrunler}){


      const [yeniCesit, setYeniCesit] = useState('');
      const [yeniFiyat, setYeniFiyat] = useState(0);
    
      const kahve_ekle = () => {
    
        if (yeniCesit.trim() === '' || isNaN(yeniFiyat) || String(yeniFiyat).trim() ==='') {
          alert("Geçerli bir çeşit ve fiyat giriniz.");
          return;
        }
    
        setUrunler(prev => [
          ...prev,
          {
            cesit: yeniCesit,
            fiyat: yeniFiyat
          }
        ]);
       
    
      };
    
    
        useEffect(() => {
    
          if (yeniCesit.trim() !== '' && !isNaN(yeniFiyat)) {
                console.log(`Tabloya eklendi: Ürün: ${yeniCesit} / Fiyat: ${yeniFiyat}`);
          }
    
    
          setYeniCesit('');
          setYeniFiyat('');
    
        }, [urunler]);


    return(

           
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
          onChange={(e) => setYeniFiyat(Number(e.target.value))}
        />
        <button onClick={kahve_ekle} className="AddButton">Ekle</button>
      </div>


    );

}


export default AddCoffee;