// src/App.js

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GameBoard from './GameBoard';
import { initializeGame, tickTimer, updateHighScore, stopGame } from './redux/gameSlice';
import './App.css'; // Yeni App.css dosyasını kullanacağız

function App() {
  const dispatch = useDispatch();
  const {
    score,
    highScore,
    matchesAttempted,
    correctMatches,
    secondsElapsed,
    isGameActive,
    cards // Oyunun bittiğini anlamak için kartları da alıyoruz
  } = useSelector((state) => state.game);

  // Zamanlayıcı
  useEffect(() => {
    let timer;
    if (isGameActive) {
      timer = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, dispatch]);

  // Oyunun bitip bitmediğini kontrol et
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      dispatch(stopGame());
      dispatch(updateHighScore());
    }
  }, [cards, dispatch]);
  
  const handleRestart = () => {
    dispatch(initializeGame());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const accuracy = matchesAttempted > 0
    ? ((correctMatches / matchesAttempted) * 100).toFixed(0)
    : 0;

  return (
    <div className="game-container">
      {/* SOL PANEL */}
      <aside className="left-panel">
        <div className="info-box">
          <h2 className="info-title">SKOR</h2>
          <div className="digital-display score-display">{score.toString().padStart(6, '0')}</div>
        </div>

        <div className="info-box stats-box">
          <div className="stat-item">
            <span>Yapılan Deneme</span>
            <strong>{matchesAttempted}</strong>
          </div>
          <div className="stat-item">
            <span>Doğru Eşleşme</span>
            <strong>{correctMatches}</strong>
          </div>
          <div className="stat-item">
            <span>Başarı Yüzdesi</span>
            <strong>%{accuracy}</strong>
          </div>
        </div>

        <div className="info-box high-score-box">
          <h3 className="info-title-small">EN YÜKSEK SKOR</h3>
          <div className="high-score-display">{highScore}</div>
        </div>
      </aside>

      {/* ORTA PANEL (OYUN ALANI) */}
      <main className="main-content">
        <GameBoard />
      </main>

      {/* SAĞ PANEL */}
      <aside className="right-panel">
        <div className="info-box">
          <h2 className="info-title">ZAMAN</h2>
          <div className="digital-display timer-display">{formatTime(secondsElapsed)}</div>
        </div>
        
        <div className="info-box" style={{display:"flex",justifyContent:"center"}}>
          <button className="btn-3d" onClick={handleRestart}>
            Yeniden Başlat
          </button>
        </div>

        <div className="info-box how-to-play">
          <h4>Nasıl Oynanır?</h4>
          <p>
            Tüm kart çiftlerini en kısa sürede ve en az denemeyle eşleştirin. Her doğru eşleşme puan kazandırır.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default App;