import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from './redux/gameSlice'; 

function RightSide() {
  const dispatch = useDispatch();
  const { gameMode, timeLeft } = useSelector((state) => state.game);


  const handleRestart = () => {
    dispatch(openModal());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <aside className="right-panel">
      <div className="info-box">
        <h2 className="info-title">ZAMAN</h2>
        <div className="digital-display timer-display">
          {gameMode === 'timed' ? formatTime(timeLeft) : '∞'}
        </div>
      </div>

      <div className="info-box" style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="btn-3d" onClick={handleRestart}>
          Yeni Oyun
        </button>
      </div>

      <div className="info-box how-to-play">
        <h4>Nasıl Oynanır?</h4>
        <p>
          Tüm kart çiftlerini eşleştir. Peş peşe bulduğun eşleşmeler daha çok puan kazandırır!
        </p>
      </div>
    </aside>
  );
}

export default RightSide;