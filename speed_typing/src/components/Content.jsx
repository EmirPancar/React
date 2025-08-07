import { useEffect, useRef, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetGame, setUserInput, processCurrentWord, startGame, decrementTimer, endGame } from '../redux/gameSlice';
import './ContentStyle.css';

const WORDS_PER_LINE = 11;

const Content = () => {
  const dispatch = useDispatch();
  const { wordsToDisplay, wordStatuses, currentWordIndex, userInput, timer, gameStatus } = useSelector((state) => state.game);
  
  const inputRef = useRef(null);
  
  const [viewStartIndex, setViewStartIndex] = useState(0);

  
  useEffect(() => {
    let interval = null;
    if (gameStatus === 'running' && timer > 0) {
      interval = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus, timer, dispatch]);

  useEffect(() => {
    if (timer === 0 && gameStatus === 'running') {
      dispatch(endGame());
    }
  }, [timer, gameStatus, dispatch]);


  useEffect(() => {
    if (currentWordIndex > 0 && currentWordIndex % WORDS_PER_LINE === 0) {
      setViewStartIndex(currentWordIndex);
    }
  }, [currentWordIndex]);

  
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (gameStatus === 'finished') return;
    if (value.endsWith(' ')) {
      if (gameStatus === 'waiting') dispatch(startGame());
      dispatch(processCurrentWord());
      return;
    }
    dispatch(setUserInput(value));
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const wordsToRender = useMemo(() => {
    const wordsInView = WORDS_PER_LINE * 2 + 5; 
    return wordsToDisplay
      .slice(viewStartIndex, viewStartIndex + wordsInView)
      .map((word, index) => {
        const actualIndex = viewStartIndex + index;
        let className = 'word';
        if (actualIndex === currentWordIndex) className += ' current-word';
        else if (actualIndex < currentWordIndex) className += wordStatuses[actualIndex] ? ' correct-word' : ' incorrect-word';
        return <span key={actualIndex} className={className}>{word}</span>;
      });
  }, [viewStartIndex, wordsToDisplay, wordStatuses, currentWordIndex]);

  return (
    <div className='ContentContainer'>
      
      <div className='TextArea'>
        <p>{wordsToRender}</p>
      </div>

      <input
        ref={inputRef}
        type="text"
        className='InputField'
        value={userInput}
        onChange={handleInputChange}
        disabled={gameStatus === 'finished'}
        autoFocus
      />

      <div className="ControlsContainer">
        <button className="ResetButton" onClick={() => {
          dispatch(resetGame());
          setViewStartIndex(0);
        }}>
            Yenile
        </button>
        <div className='Timer'>{formatTime(timer)}</div>
      </div>
    </div>
  );
};

export default Content;