import './App.css';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';
import { useSelector } from 'react-redux';

function App() {
  const status = useSelector((state) => state.quiz.status);

  return (
    <div className='MainFrame'>
      {status === 'idle' && <Home />}
      {status === 'active' && <Quiz />}
      {status === 'finished' && <Results />}
    </div>
  );
}

export default App;