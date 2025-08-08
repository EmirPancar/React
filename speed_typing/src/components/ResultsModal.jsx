import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetGame } from '../redux/gameSlice';
import { addScore } from '../redux/leaderboardSlice';
import './ResultsModal.css';

const ResultsModal = () => {
    const { isModalOpen, stats } = useSelector((state) => state.game);
    const dispatch = useDispatch();
    const [name, setName] = useState('');

    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            setIsSaved(false);
        }
    }, [isModalOpen]);

    const handleSaveScore = () => {
        if (name.trim() === '') {
            alert('Lütfen bir isim girin.');
            return;
        }
        dispatch(addScore({ name, wpm: stats.wpm }));
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
                    <input
                        type="text"
                        placeholder="İsminizi girin..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSaved}
                    />
                    <button
                        onClick={handleSaveScore}
                        disabled={isSaved}
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