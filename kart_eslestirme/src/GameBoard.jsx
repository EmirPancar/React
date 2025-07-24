import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import Card from './Card.jsx';
import { checkMatch } from './redux/gameSlice';
import './GameBoardStyle.css';

function GameBoard() {
  const dispatch = useDispatch();
  const { cards, flippedCards } = useSelector((state) => state.game);

  useEffect(() => {

    if (flippedCards && flippedCards.length === 2) {
      
      const timer = setTimeout(() => {
        dispatch(checkMatch());
      }, 750); 
      return () => clearTimeout(timer);
    }
  }, [flippedCards, dispatch]);

 
  if (!cards || cards.length === 0) {
    return <section className="play-area placeholder"></section>;
  }

  return (
    <section className="play-area">
      {cards.map(card => (
        <Card 
          key={card.id} 
          cardData={card} 
        />
      ))}
    </section>
  );
}

export default GameBoard;