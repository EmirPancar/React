import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { answerQuestion } from '../redux/quizSlice';
import './ContentStyle.css';

const Content = () => {
    const dispatch = useDispatch();
    const { questions, currentQuestionIndex, userAnswers } = useSelector((state) => state.quiz);

    const currentQuestion = questions[currentQuestionIndex];
    const currentUserAnswer = userAnswers.find(a => a.questionIndex === currentQuestionIndex)?.answer;

    const handleOptionClick = (option) => {
        dispatch(answerQuestion({ questionIndex: currentQuestionIndex, answer: option }));
    };

    return (
        <div className='MainContent'>
            <h2 className='QuestionTitle'>
                {`${currentQuestionIndex + 1}. Soru`}
            </h2>

            <div className='QuestionBox'>
                {currentQuestion.question}
            </div>
            
            <div className='OptionsContainer'>
                {currentQuestion.options.map((option, index) => (
                    <div
                        key={index}
                        className={`Option ${currentUserAnswer === option ? 'selected' : ''}`}
                        onClick={() => handleOptionClick(option)}
                    >
                        {option}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Content;