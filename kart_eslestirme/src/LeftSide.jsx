import React from 'react';
import { useSelector } from 'react-redux';

function LeftSide() {
  const { score, highScore, matchesAttempted, correctMatches } = useSelector(
    (state) => state.game
  );

  const accuracy =
    matchesAttempted > 0
      ? ((correctMatches / matchesAttempted) * 100).toFixed(0)
      : 0;

  return (
    <aside className="left-panel">
      <div className="info-box">
        <h2 className="info-title">SKOR</h2>
        <div className="digital-display score-display">
          {score.toString().padStart(6, '0')}
        </div>
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
        <div className="high-score-display">{highScore.score}</div>
        <span className="high-score-accuracy">Başarı: %{highScore.accuracy}</span>
      </div>
    </aside>
  );
}

export default LeftSide;