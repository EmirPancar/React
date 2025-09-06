import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetGame, setUserInput, processCurrentWord, startGame, decrementTimer, endGame, toggleEndlessMode } from '../redux/gameSlice';
import './ContentStyle.css';

const WORDS_PER_LINE = 10;

const Content = () => {
  const dispatch = useDispatch();
  const { allWords, wordStatuses, currentWordIndex, userInput, timer, gameStatus, isEndless } = useSelector((state) => state.game);
  
  const [viewStartIndex, setViewStartIndex] = useState(0);

  useEffect(() => {
    let interval = null;
    if (gameStatus === 'running' && timer > 0 && !isEndless) {
      interval = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000);
    } else if (timer === 0 && gameStatus === 'running' && !isEndless) {
      dispatch(endGame());
    }
    return () => clearInterval(interval);
  }, [gameStatus, timer, dispatch, isEndless]);

  useEffect(() => {
    if (currentWordIndex === 0) {
      setViewStartIndex(0);
    }
  }, [currentWordIndex]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (gameStatus === 'finished') return;

    if (gameStatus === 'waiting' && value.length > 0) {
      dispatch(startGame());
    }

    if (value.endsWith(' ')) {
      if ((currentWordIndex + 1) % WORDS_PER_LINE === 0) {
        setViewStartIndex(currentWordIndex + 1);
      }
      dispatch(processCurrentWord());
    } else {
      dispatch(setUserInput(value));
    }
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const linesToRender = useMemo(() => {
    const wordsInView = allWords.slice(viewStartIndex, viewStartIndex + (WORDS_PER_LINE * 4));
    
    const lines = [];
    for (let i = 0; i < wordsInView.length; i += WORDS_PER_LINE) {
      lines.push(wordsInView.slice(i, i + WORDS_PER_LINE));
    }
    
    return lines;
  }, [viewStartIndex, allWords]);

  return (
    <div className='ContentContainer'>
      
      <div className='TextArea'>
        {linesToRender.map((line, lineIndex) => (
          <div key={lineIndex} className="word-line">
            {line.map((word, wordIndexInLine) => {
              const actualIndex = viewStartIndex + (lineIndex * WORDS_PER_LINE) + wordIndexInLine;
              let className = 'word';
              if (actualIndex === currentWordIndex) {
                className += ' current-word';
              } else if (actualIndex < currentWordIndex) {
                className += wordStatuses[actualIndex] ? ' correct-word' : ' incorrect-word';
              }
              return <span key={actualIndex} className={className}>{word}</span>;
            })}
          </div>
        ))}
      </div>

      <input
        type="text"
        className='InputField'
        value={userInput}
        onChange={handleInputChange}
        disabled={gameStatus === 'finished'}
        autoFocus
      />

      <div className="ControlsContainer">
        <button className="ResetButton" onClick={() => dispatch(resetGame())}>
            Yenile
        </button>
        <button className="ResetButton" onClick={() => dispatch(toggleEndlessMode())}>
            {isEndless ? 'Süreli' : 'Sonsuz'}
        </button>
        {!isEndless && <div className='Timer'>{formatTime(timer)}</div>}
      </div>
    </div>
  );
};

export default Content;