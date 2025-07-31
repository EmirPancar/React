import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Bileşenleri import et
import Content from './Content';
import Footer from './Footer';

// Gerekli Redux action'larını ve stil dosyasını import et
import { setTimer, finishQuiz } from '../redux/quizSlice';
import './QuizStyle.css';

const Quiz = () => {
    const dispatch = useDispatch();
    const { timer, status } = useSelector((state) => state.quiz);

    // Zamanlayıcıyı yöneten useEffect hook'u
    useEffect(() => {
        if (status !== 'active') {
            return;
        }

        if (timer <= 0) {
            dispatch(finishQuiz());
            return;
        }

        const interval = setInterval(() => {
            dispatch(setTimer(timer - 1));
        }, 1000);

        // Component kaldırıldığında interval'ı temizle (hafıza sızıntısını önler)
        return () => clearInterval(interval);

    }, [timer, status, dispatch]);

    return (
        // Bu sarmalayıcı, Content ve Footer'ın dikey flex düzenini korur
        <div className="quiz-container">
            <Content />
            <Footer />
        </div>
    );
};

export default Quiz;