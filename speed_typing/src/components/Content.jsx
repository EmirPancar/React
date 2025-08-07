import { useEffect, useRef, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetGame, setUserInput, processCurrentWord, startGame, decrementTimer, endGame } from '../redux/gameSlice';
import './ContentStyle.css';

// SABİT SATIR UZUNLUĞU
const WORDS_PER_LINE = 11;

const Content = () => {
  const dispatch = useDispatch();
  const { wordsToDisplay, wordStatuses, currentWordIndex, userInput, timer, gameStatus } = useSelector((state) => state.game);
  
  const inputRef = useRef(null);
  
  // Ekranda gösterilecek kelime bloğunun başlangıç indeksini tutan state.
  // Bu, anlık "snap" efektinin temelidir.
  const [viewStartIndex, setViewStartIndex] = useState(0);

  // --- MODAL SORUNUNU ÇÖZEN KISIM BAŞLANGICI ---
  // Sorumlulukları ayırmak, hataları önler.
  
  // 1. Zamanlayıcıyı çalıştıran useEffect
  useEffect(() => {
    let interval = null;
    if (gameStatus === 'running' && timer > 0) {
      interval = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus, timer, dispatch]);

  // 2. Oyunun bitişini kontrol eden useEffect
  useEffect(() => {
    if (timer === 0 && gameStatus === 'running') {
      dispatch(endGame());
    }
  }, [timer, gameStatus, dispatch]);
  // --- MODAL SORUNUNU ÇÖZEN KISIM SONU ---


  // ANA "SNAP" MANTIĞI: Satır bittiğinde, render edilen pencereyi kaydır.
  useEffect(() => {
    // Eğer kullanıcının bulunduğu kelimenin indeksi, 11'in katıysa bir satır bitmiştir.
    if (currentWordIndex > 0 && currentWordIndex % WORDS_PER_LINE === 0) {
      // Görünen kelime bloğunun başlangıcını, mevcut konuma ayarla.
      // Bu, eski satırın render edilmemesini sağlar.
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

  // Ekranda gösterilecek kelimeleri `viewStartIndex`'e göre keserek oluştur.
  const wordsToRender = useMemo(() => {
    // Ekranda her zaman 2 satır + alttan gelecekler için küçük bir tampon render et.
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
        {/* Artık `transform` stili yok. Sadece render edilen kelimeler değişiyor. */}
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
          setViewStartIndex(0); // Oyunu sıfırlarken başlangıç penceresini de sıfırla.
        }}>
            Yenile
        </button>
        <div className='Timer'>{formatTime(timer)}</div>
      </div>
    </div>
  );
};

export default Content;