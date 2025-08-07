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
  const [viewStartIndex, setViewStartIndex] = useState(0);

  // ZAMANLAYICI VE OYUN BİTİŞ MANTIĞI
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


  // ÇÖZÜM 1: "TEKRAR OYNAT" SORUNUNU GİDEREN useEffect
  // Bu useEffect, Redux'taki oyun sıfırlandığında (currentWordIndex 0 olduğunda)
  // bu bileşenin yerel state'ini de (viewStartIndex) sıfırlar.
  useEffect(() => {
    if (currentWordIndex === 0) {
      setViewStartIndex(0);
    }
  }, [currentWordIndex]);


  // KULLANICI GİRDİSİNİ VE "SNAP" EFEKTİNİ YÖNETEN FONKSİYON
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (gameStatus === 'finished') return;

    // Zamanlayıcıyı başlat
    if (gameStatus === 'waiting' && value.length > 0) {
      dispatch(startGame());
    }

    // Eğer kullanıcı boşluk tuşuna basmadıysa, sadece input'u güncelle ve devam etme.
    if (!value.endsWith(' ')) {
      dispatch(setUserInput(value));
      return;
    }

    // ÇÖZÜM 2: KUSURSUZ "SNAP" MANTIĞI
    // Eğer mevcut kelime, görünen satırın SON kelimesi ise...
    if (currentWordIndex === viewStartIndex + WORDS_PER_LINE - 1) {
      // Bir sonraki render için başlangıç indeksini bir satır ileri taşı.
      // Bu, eski satırın render edilmemesini sağlayarak "snap" efektini yaratır.
      setViewStartIndex(prev => prev + WORDS_PER_LINE);
    }
    
    // Tüm kontrollerden sonra, kelimeyi işle.
    dispatch(processCurrentWord());
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  // Ekranda gösterilecek kelimeleri `viewStartIndex`'e göre keserek oluştur.
  const wordsToRender = useMemo(() => {
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
        {/* Render edilen kelimeler anında değiştiği için "snap" efekti oluşur */}
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
          // Butona basıldığında da yerel state'i sıfırlamak iyi bir pratiktir.
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