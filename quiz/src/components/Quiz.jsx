import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Content from './Content';
import Footer from './Footer';
import { setTimer, finishQuiz } from '../redux/quizSlice';
import './QuizStyle.css';

const Quiz = () => {
    const dispatch = useDispatch();
    const { timer, status } = useSelector((state) => state.quiz);


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

        return () => clearInterval(interval);

    }, [timer, status, dispatch]);

    return (
        <div className="quiz-container">
            <Content />
            <Footer />
        </div>
    );
};

export default Quiz;