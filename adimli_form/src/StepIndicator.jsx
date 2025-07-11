import React from "react";
import "./App.css";

function StepIndicator({ ekran, toplamAdim = 4 }) {
  return (
    <div className="step-wrapper">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((ekran - 1) / (toplamAdim - 1)) * 100}%` }}
        ></div>
      </div>

      <div className="step-container">
        {Array.from({ length: toplamAdim }, (_, i) => {
          const step = i + 1;
          const durum =
            step < ekran
              ? "completed"
              : step === ekran
              ? "active"
              : "inactive";

          return (
            <div key={step} className={`step ${durum}`}>
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;