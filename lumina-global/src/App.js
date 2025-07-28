// import { useEffect } from 'react';
import './App.css';
// import axios from 'axios'
import Header from './Header';
import Slider from './Slider'
import Catalog from './Catalog';
import { useTranslation } from 'react-i18next';
import { use } from 'react';


function App() {

  const {t,i18n} = useTranslation();


  return (
    <>
      <Header/>
      <Slider/>
      <Catalog/>
    </>

  );
}

export default App;
