import { useEffect } from 'react'; 
import './App.css';
import Header from './Header';
import Slider from './Slider'
import Catalog from './Catalog';
import { useTranslation } from 'react-i18next';
function App() {
const { i18n } = useTranslation();

useEffect(() => {
const isRtl = i18n.language === 'ar';
const htmlTag = document.documentElement;

htmlTag.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
htmlTag.classList.toggle('rtl', isRtl);
htmlTag.classList.toggle('ltr', !isRtl);

}, [i18n.language]); 
return (
<>
<Header/>
<Slider/>
<Catalog/>
</>
);
}
export default App;