import './LeaderboardMenu.css';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLeaderboard } from '../redux/leaderboardSlice';

const LeaderboardMenu = () => {
    const { isMenuOpen, scores } = useSelector((state) => state.leaderboard);
    const dispatch = useDispatch();

    return (
        <>
            <div className={`overlay ${isMenuOpen ? 'show' : ''}`} onClick={() => dispatch(toggleLeaderboard())}></div>
            <div className={`LeaderboardContainer ${isMenuOpen ? 'open' : ''}`}>
                <h2>Liderlik Tablosu</h2>
                <ul className='ScoreList'>
                    {scores.length > 0 ? (
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
                    )}
                </ul>
                <button onClick={() => dispatch(toggleLeaderboard())}>Kapat</button>
            </div>
        </>
    );
};

export default LeaderboardMenu;