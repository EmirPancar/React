import { useState } from "react";
import Forms from './Forms';
import Footer from './Footer';

function Navigation() {
  const [ekran, setEkran] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false); 

    const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    tel: "",
    email: ""
  });

  return (
    <>
      <div className='Mid'>
        <Forms ekran={ekran} setIsFormValid={setIsFormValid} formData={formData} setFormData={setFormData} /> 
      </div>
      <Footer ekran={ekran} setEkran={setEkran} ileriAktif={isFormValid} />
    </>
  );
}

export default Navigation;