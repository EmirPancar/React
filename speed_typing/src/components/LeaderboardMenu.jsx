import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLeaderboard, fetchScores } from '../redux/leaderboardSlice'; 
import './LeaderboardMenu.css';

const LeaderboardMenu = () => {
    const { isMenuOpen, scores, status, error } = useSelector((state) => state.leaderboard);
    const dispatch = useDispatch();

    useEffect(() => {

        if (isMenuOpen && status === 'idle') {
            dispatch(fetchScores());
        }
    }, [isMenuOpen, status, dispatch]); 

    let content;
    if (status === 'loading') {
        content = <p className="loading-message">Yükleniyor...</p>;
    } else if (status === 'succeeded') {
        content = scores.length > 0 ? (
            scores.map((score, index) => (
                <li key={score.id}>
                    <div className="score-main">
                        <span>#{index + 1} {score.name}</span>
                        <span>{score.wpm} WPM</span>
                    </div>
                    <div className="score-details-tooltip">
                        <p>Doğruluk: <strong>%{score.accuracy}</strong></p>
                        <p>Doğru Kelime: <strong>{score.correctWords}</strong></p>
                        <p>Yanlış Kelime: <strong>{score.wrongWords}</strong></p>
                    </div>
                </li>
            ))
        ) : (
            <p>Henüz kayıtlı skor yok.</p>
        );
    } else if (status === 'failed') {
        console.error("Failed to fetch scores:", error); 
        content = <p className="error-message">Skorlar yüklenemedi. Lütfen tekrar deneyin.</p>;
    }

    return (
        <>
            <div className={`overlay ${isMenuOpen ? 'show' : ''}`} onClick={() => dispatch(toggleLeaderboard())}></div>
            <div className={`LeaderboardContainer ${isMenuOpen ? 'open' : ''}`}>
                <h2>Liderlik Tablosu</h2>
                <ul className='ScoreList'>
                    {content}
                </ul>
                <button onClick={() => dispatch(toggleLeaderboard())}>Kapat</button>
            </div>
        </>
    );
};

export default LeaderboardMenu;