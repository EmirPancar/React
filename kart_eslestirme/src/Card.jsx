import React from 'react';
import { useDispatch } from 'react-redux';
import { flipCard } from './redux/gameSlice';
import './CardStyle.css';

function Card({ cardData }) {
  const dispatch = useDispatch();

  if (!cardData || !cardData.value) {
    return null;
  }

  const { id, value, isFlipped, isMatched } = cardData;

  const handleClick = () => {
    if (!isMatched && !isFlipped) {
      dispatch(flipCard(id));
    }
  };

  const cardFrontImage = `${process.env.PUBLIC_URL}/Cards/${value}.png`;

  return (
    <div 
      className={`card-container ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={handleClick}
    >
      <div className="card-inner">
        <div className="card-back">
        </div>
        <div className="card-front">
          <img src={cardFrontImage} alt={value.replace(/_/g, ' ')} />
        </div>
      </div>
    </div>
  );
}

export default Card;