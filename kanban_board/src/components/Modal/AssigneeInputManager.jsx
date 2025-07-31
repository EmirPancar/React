import React from 'react';
import './AssigneeInputManager.css'; // Stil dosyasını birazdan oluşturacağız

const AssigneeInputManager = ({ assignees, onAssigneesChange }) => {
  const handleInputChange = (index, event) => {
    const newAssignees = [...assignees];
    newAssignees[index] = event.target.value;
    onAssigneesChange(newAssignees);
  };

  const handleAddInput = () => {
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
            type="text"
            placeholder="Atanan Kişi"
            value={assignee}
            onChange={(e) => handleInputChange(index, e)}
            autoComplete="off"
          />
          {/* Sadece 1'den fazla input varsa silme butonunu göster */}
          {assignees.length > 1 && (
            <button
              type="button"
              className="btn-assignee remove-btn"
              onClick={() => handleRemoveInput(index)}
            >
              -
            </button>
          )}
          {/* Sadece son elemanın yanında ekleme butonunu göster */}
          {index === assignees.length - 1 && (
            <button
              type="button"
              className="btn-assignee add-btn"
              onClick={handleAddInput}
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