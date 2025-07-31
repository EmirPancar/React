import React, { useEffect, useRef } from 'react';
import './AssigneeInputManager.css';

const AssigneeInputManager = ({ assignees, onAssigneesChange }) => {
  const inputRefs = useRef([]);
  const prevAssigneesLength = useRef(assignees.length);

  const isAddDisabled = assignees.length > 0 && assignees[assignees.length - 1].trim() === '';

  useEffect(() => {
    if (assignees.length > prevAssigneesLength.current) {
      const lastInput = inputRefs.current[assignees.length - 1];
      if (lastInput) {
        lastInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        lastInput.focus();
      }
    }

    prevAssigneesLength.current = assignees.length;
  }, [assignees.length]); 

  const handleInputChange = (index, event) => {
    const newAssignees = [...assignees];
    newAssignees[index] = event.target.value;
    onAssigneesChange(newAssignees);
  };

  const handleAddInput = () => {
    if (isAddDisabled) return;
    onAssigneesChange([...assignees, '']);
  };

  const handleRemoveInput = (index) => {
    const newAssignees = assignees.filter((_, i) => i !== index);
    onAssigneesChange(newAssignees);
  };

  return (
    <div className="assignee-manager">
      <label className="assignee-label">Atanan Kişiler</label>
      {assignees.map((assignee, index) => (
        <div key={index} className="assignee-input-row">
          <input
            ref={el => (inputRefs.current[index] = el)}
            type="text"
            placeholder="Atanan Kişi"
            value={assignee}
            onChange={(e) => handleInputChange(index, e)}
            autoComplete="off"
          />
          {assignees.length > 1 && (
            <button
              type="button"
              className="btn-assignee remove-btn"
              onClick={() => handleRemoveInput(index)}
            >
              -
            </button>
          )}
          {index === assignees.length - 1 && (
            <button
              type="button"
              className="btn-assignee add-btn"
              onClick={handleAddInput}
              disabled={isAddDisabled}
              title={isAddDisabled ? "Yeni kişi eklemek için mevcut alanı doldurun" : "Yeni kişi ekle"}
            >
              +
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AssigneeInputManager;