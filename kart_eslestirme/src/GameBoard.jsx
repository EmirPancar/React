// src/GameBoard.js

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { initializeGame } from './redux/gameSlice'; 
import Card from './Card.jsx';
import './GameBoardStyle.css';

function GameBoard() {
  const dispatch = useDispatch();
  // DÜZELTME: State'e artık state.game.cards üzerinden erişiyoruz.
  const cards = useSelector((state) => state.game.cards);

  useEffect(() => {
    // Eğer kartlar yoksa veya oyun yeni başladıysa (panellerin kontrolü App.js'te)
    if (!cards || cards.length === 0) {
      dispatch(initializeGame());
    }
  }, [dispatch, cards]); 

  return (
    <section className="play-area">
      {cards.map(cardData => (
        <Card 
          key={cardData.id} 
          id={cardData.id} 
          // Card bileşenine isFlipped ve isMatched prop'larını da göndermek,
          // gelecekteki animasyonlar için faydalı olacaktır.
          isFlipped={cardData.isFlipped}
          isMatched={cardData.isMatched}
        />
      ))}
    </section>
  );
}

export default GameBoard;