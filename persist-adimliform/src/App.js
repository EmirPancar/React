import './App.css';
import Header from './Header';
import Footer from './Footer'
import Forms from './Forms';
import { useSelector } from 'react-redux';

function App() {

  const currentStep = useSelector((state) => state.form.currentStep);

  return (
    <div className='Container'>
      <Header/>
      <div className='Mid'>
        <Forms/>
      </div>
      <Footer ekran={currentStep}/>
    </div>
  );
}

export default App;
