import { useSelector, useDispatch } from 'react-redux';
import { nextQuestion, prevQuestion, finishQuiz } from '../redux/quizSlice';
import './FooterStyle.css'

const Footer = () => {
  const dispatch = useDispatch();
  const { currentQuestionIndex, questions, timer, userAnswers } = useSelector(state => state.quiz);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className='MainFooter'>
      <button 
        className='navButton prevButton'
        onClick={() => dispatch(prevQuestion())}
        disabled={currentQuestionIndex === 0}
      />
      
      <div className='StepIndicator'>
        {questions.map((_, index) => {
          const isAnswered = userAnswers.some(a => a.questionIndex === index);
          let stepClass = 'step';
          if (index === currentQuestionIndex) stepClass += ' current';
          if (isAnswered) stepClass += ' answered';

          return <div key={index} className={stepClass}>{isAnswered ? '' : index + 1}</div>;
        })}
      </div>

      <div className='Timer'>
        {`0${Math.floor(timer / 60)}`.slice(-2)}:{`0${timer % 60}`.slice(-2)}
      </div>
      
      {isLastQuestion ? (
        <button className='finishButton' onClick={() => dispatch(finishQuiz())}>
            Testi Bitir
        </button>
      ) : (
        <button 
            className='navButton nextButton'
            onClick={() => dispatch(nextQuestion())}
        />
      )}
    </div>
  );
};

export default Footer;