import StepIndicator from "./StepIndicator";
import { useDispatch, useSelector } from "react-redux";
import { nextStep, prevStep } from "./redux/formSlice";

function Footer() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.form.currentStep);
  const isFormValid = useSelector((state) => state.form.isFormValid); // isteğe bağlı

  const handleNext = () => {
    if (currentStep < 4 && isFormValid) {
      dispatch(nextStep());
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      dispatch(prevStep());
    }
  };

  return (
    <div className="Footer">
      <button
        onClick={handlePrev}
        className="prevBut"
        disabled={currentStep === 1}
        style={{
          opacity: currentStep === 1 ? 0.5 : 1,
          pointerEvents: currentStep === 1 ? "none" : "auto",
        }}
      >
        Önceki Sayfa
      </button>

      <StepIndicator ekran={currentStep} />

      <button
        onClick={handleNext}
        className="nextBut"
        disabled={currentStep === 4 || !isFormValid}
        style={{
          opacity: currentStep === 4 || !isFormValid ? 0.5 : 1,
          pointerEvents: currentStep === 4 || !isFormValid ? "none" : "auto",
        }}
      >
        Sonraki Sayfa
      </button>
    </div>
  );
}

export default Footer;
