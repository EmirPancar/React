import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetGame, setUserInput, processCurrentWord, startGame, decrementTimer, endGame } from '../redux/gameSlice';
import './ContentStyle.css';

// Sabit satır uzunluğunu tanımlıyoruz. Tüm mantık buna göre çalışacak.
const WORDS_PER_LINE = 11;

const Content = () => {
  const dispatch = useDispatch();
  const { allWords, wordStatuses, currentWordIndex, userInput, timer, gameStatus } = useSelector((state) => state.game);
  
  // Ekranda gösterilen kelime bloğunun başlangıç indeksini tutan state.
  // Bu, "snap" efektinin temelidir.
  const [viewStartIndex, setViewStartIndex] = useState(0);

  // Zamanlayıcı ve oyun bitiş mantığı (hatasız versiyon)
  useEffect(() => {
    let interval = null;
    if (gameStatus === 'running' && timer > 0) {
      interval = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000);
    } else if (timer === 0 && gameStatus === 'running') {
      dispatch(endGame());
    }
    return () => clearInterval(interval);
  }, [gameStatus, timer, dispatch]);


  // KUSURSUZ "SNAP" MANTIĞI:
  // Bu useEffect, sadece `currentWordIndex` değiştiğinde çalışır.
  useEffect(() => {
    // Koşul: Mevcut kelime indeksi, satırın başlangıcından 11 kelime ileride mi?
    // Örnek: viewStartIndex = 0 iken, currentWordIndex 11 olduğunda bu koşul sağlanır.
    // Örnek: viewStartIndex = 11 iken, currentWordIndex 22 olduğunda bu koşul sağlanır.
    if (currentWordIndex > 0 && (currentWordIndex - viewStartIndex) >= WORDS_PER_LINE) {
      // Yeni görünümün başlangıcını, biten satırın sonrasına ayarla.
      setViewStartIndex(prev => prev + WORDS_PER_LINE);
    }
  }, [currentWordIndex, viewStartIndex]);

  
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (gameStatus === 'finished') return;

    // Zamanlayıcıyı başlat
    if (gameStatus === 'waiting' && value.length > 0) {
      dispatch(startGame());
    }

    // Space'e basıldıysa kelimeyi işle, basılmadıysa sadece input'u güncelle.
    if (value.endsWith(' ')) {
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

  // Ekranda gösterilecek kelimeleri `viewStartIndex`'e göre keserek oluştur.
  const wordsToRender = useMemo(() => {
    // Ekranda her zaman 2 satır + alttan gelecekler için küçük bir tampon render et.
    const wordsInView = WORDS_PER_LINE * 2 + 5; 
    return allWords
      .slice(viewStartIndex, viewStartIndex + wordsInView)
      .map((word, index) => {
        const actualIndex = viewStartIndex + index;
        let className = 'word';
        if (actualIndex === currentWordIndex) {
          className += ' current-word';
        } else if (actualIndex < currentWordIndex) {
          className += wordStatuses[actualIndex] ? ' correct-word' : ' incorrect-word';
        }
        return <span key={actualIndex} className={className}>{word}</span>;
      });
  }, [viewStartIndex, allWords, wordStatuses, currentWordIndex]);

  return (
    <div className='ContentContainer'>
      
      <div className='TextArea'>
        {/* Artık `transform` stili yok. Sadece render edilen kelimeler değişiyor. */}
        <p>{wordsToRender}</p>
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
        <button className="ResetButton" onClick={() => {
          dispatch(resetGame());
          // Oyunu sıfırlarken başlangıç penceresini de mutlaka sıfırla!
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