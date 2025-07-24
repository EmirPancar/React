import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GameBoard from './GameBoard';
import GameModeModal from './GameModeModal';
import LeftSide from './LeftSide'; 
import RightSide from './RightSide'; 
import { tickTimer } from './redux/gameSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  
  const {
    isGameActive,
    gameMode,
    isModalOpen,
    gameStatus,
  } = useSelector((state) => state.game);

  useEffect(() => {
    let timer;
    if (isGameActive && gameMode === 'timed') {
      timer = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, gameMode, dispatch]);

  return (
    <>
      <GameModeModal isOpen={isModalOpen} />
      <div className="game-container">
    
        <LeftSide />
   
        <main className="main-content">
          <GameBoard />
          {gameStatus === 'won' && <div className="game-over-message won">Kazandın!</div>}
          {gameStatus === 'lost' && <div className="game-over-message lost">Süre Doldu!</div>}
        </main>
        
        <RightSide />
      </div>
    </>
  );
}

export default App;