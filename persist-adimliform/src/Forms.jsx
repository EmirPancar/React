import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';
import { useSelector } from 'react-redux';

function Forms() {

    const currentStep = useSelector((state) => state.form.currentStep);

    return (

    <div>
      {currentStep === 1 && <Form1 />}
      {currentStep === 2 && <Form2 />}
      {currentStep === 3 && <Form3 />}
      {currentStep === 4 && <Form4 />}
    </div>


    );

}

export default Forms;