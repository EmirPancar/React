import './App.css';
import Header from './components/Header'
import Footer from './components/Footer';
import Content from './components/Content';
import LeaderboardMenu from './components/LeaderboardMenu';
import ResultsModal from './components/ResultsModal';

function App() {
  return (
    <div className='MainContainer'>
      <LeaderboardMenu />
      <ResultsModal />
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

export default App;