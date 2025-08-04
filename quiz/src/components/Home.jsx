import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import StartModal from './StartModal';
import './HomeStyle.css'; 

const Home = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const scores = useSelector((state) => state.leaderboard.scores);

    return (
        <div className="home-container">
            <StartModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

            <div className="welcome-section">
                <h1>Ülkelerin Başkentleri Quizi</h1>
                <p>Bilgini test etmeye hazır mısın? 10 soruyu cevaplamak için 90 saniyen var!</p>
                <button className="start-button" onClick={() => setModalOpen(true)}>
                    Testi Başlat
                </button>
            </div>

            <div className="leaderboard-section">
                <h2>🏆 Liderlik Tablosu</h2>
                {scores.length > 0 ? (
                    <ol>
                        {scores.map((score, index) => (
                            <li key={index}>
                                <span>{score.name}</span>
                                <span>{score.score} Puan</span>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p>Henüz kimse testi tamamlamadı. İlk sen ol!</p>
                )}
            </div>
        </div>
    );
};

export default Home;