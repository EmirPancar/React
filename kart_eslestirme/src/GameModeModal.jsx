import React from 'react';
import { useDispatch } from 'react-redux';
import { initializeGame } from './redux/gameSlice';
import './Modal.css'; 

function GameModeModal({ isOpen }) {
  const dispatch = useDispatch();

  if (!isOpen) {
    return null;
  }

  const handleModeSelect = (mode) => {
    dispatch(initializeGame({ mode }));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Oyun Modunu Seç</h2>
        <div className="modal-actions">
          <button className="btn-modal" onClick={() => handleModeSelect('timed')}>
            Zaman Sınırlı
          </button>
          <button className="btn-modal" onClick={() => handleModeSelect('unlimited')}>
            Sınırsız Süre
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameModeModal;