import React from 'react';
import { useDispatch } from 'react-redux';
import { flipCard } from './redux/gameSlice'; 
import './CardStyle.css'; 


function Card({ id }) {
  const dispatch = useDispatch();

  const handleClick = () => {
    
    dispatch(flipCard(id));
  };

  return (
    <button 
      className="Card" 
      onClick={handleClick} 
      aria-label={`Oyun Kartı ${id}`}
    ></button>
  );
}

export default Card;