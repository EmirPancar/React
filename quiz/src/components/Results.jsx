import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addScore } from '../redux/leaderboardSlice';
import { resetQuiz } from '../redux/quizSlice';
import './ResultsStyle.css'; // Sonuçlar için özel stiller

const Results = () => {
    const dispatch = useDispatch();
    const { questions, userAnswers, userName } = useSelector((state) => state.quiz);

    // Skoru hesapla
    let score = 0;
    userAnswers.forEach(answer => {
        if (questions[answer.questionIndex].answer === answer.answer) {
            score += 10; // Her doğru cevap 10 puan
        }
    });

    // Component ilk render edildiğinde skoru liderlik tablosuna ekle
    useEffect(() => {
        dispatch(addScore({ name: userName, score }));
    }, [dispatch, userName, score]);

    const handleRestart = () => {
        dispatch(resetQuiz());
    };

    return (
        <div className="results-container">
            <h2>Test Tamamlandı!</h2>
            <div className="score-summary">
                <p>Tebrikler, {userName}!</p>
                <p className="score">Puanın: <span>{score}</span> / 100</p>
                <p>Toplamda {score / 10} doğru ve {10 - (score / 10)} yanlış cevap verdin.</p>
            </div>

            <div className="answers-review">
                <h3>Soruların İncelenmesi</h3>
                {questions.map((q, index) => {
                    const userAnswer = userAnswers.find(a => a.questionIndex === index);
                    const isCorrect = userAnswer && userAnswer.answer === q.answer;
                    
                    return (
                        <div key={index} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                            <p className="review-question">{index + 1}. {q.question}</p>
                            <p>Senin Cevabın: {userAnswer ? userAnswer.answer : "Boş Bırakıldı"}</p>
                            {!isCorrect && <p>Doğru Cevap: {q.answer}</p>}
                        </div>
                    );
                })}
            </div>

            <button className="restart-button" onClick={handleRestart}>
                Yeniden Başla
            </button>
        </div>
    );
};

export default Results;