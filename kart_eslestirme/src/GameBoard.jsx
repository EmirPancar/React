import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { initializeGame } from './redux/gameSlice'; 
import Card from './Card.jsx';
import './GameBoardStyle.css';

function GameBoard() {
 
  const dispatch = useDispatch();

 
  const cards = useSelector((state) => state.cards);

 
  useEffect(() => {

    if (!cards || cards.length === 0) {
      dispatch(initializeGame());
    }
  }, [dispatch, cards]); 

  return (
    <section className="play-area">
      {cards.map(cardData => (
        
        <Card key={cardData.id} id={cardData.id} />
      ))}
    </section>
  );
}

export default GameBoard;