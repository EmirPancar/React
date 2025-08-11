import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetGame } from '../redux/gameSlice';
import { saveScore } from '../redux/leaderboardSlice';
import './ResultsModal.css';

const ResultsModal = () => {
    const { isModalOpen, stats } = useSelector((state) => state.game);
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const MAX_NAME_LENGTH = 12;

    useEffect(() => {
        if (isModalOpen) {
            setIsSaved(false);
            setName('');
        }
    }, [isModalOpen]);

    const handleNameChange = (e) => {
        setName(e.target.value.slice(0, MAX_NAME_LENGTH));
    };

    const handleSaveScore = () => {
        if (name.trim() === '') {
            alert('Lütfen bir isim girin.');
            return;
        }
        dispatch(saveScore({
            name: name.trim(),
            ...stats
        }));
        setIsSaved(true);
    };

    const handlePlayAgain = () => {
        dispatch(resetGame());
    };

    if (!isModalOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Süre Bitti!</h2>
                <div className="stats-container">
                    <p><strong>WPM (Dakikadaki Kelime):</strong> {stats.wpm}</p>
                    <p><strong>Doğruluk:</strong> %{stats.accuracy}</p>
                    <p><strong>Doğru Kelime:</strong> {stats.correctWords}</p>
                    <p><strong>Yanlış Kelime:</strong> {stats.wrongWords}</p>
                </div>

                <div className="save-score-section">
                    
                    <div className="input-with-counter">
                        <input
                            type="text"
                            placeholder="İsminizi girin..."
                            value={name}
                            onChange={handleNameChange} 
                            disabled={isSaved}
                        />
                        
                        <span className="char-counter">
                            {name.length}/{MAX_NAME_LENGTH}
                        </span>
                    </div>

                    <button
                        onClick={handleSaveScore}
                        disabled={isSaved || name.trim() === ''} 
                    >
                        {isSaved ? 'Skor Kaydedildi!' : 'Skoru Kaydet'}
                    </button>
                </div>

                <button className="play-again-button" onClick={handlePlayAgain}>
                    Tekrar Oyna
                </button>
            </div>
        </div>
    );
};

export default ResultsModal;