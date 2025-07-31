import React, { useEffect, useRef } from 'react';
import './AssigneeInputManager.css';

const AssigneeInputManager = ({ assignees, onAssigneesChange }) => {
  // YENİ: Otomatik kaydırma için referans
  const lastInputRef = useRef(null);

  // YENİ: Son input'un boş olup olmadığını kontrol et
  const isAddDisabled = assignees.length > 0 && assignees[assignees.length - 1].trim() === '';

  // YENİ: Atanan listesinin uzunluğu değiştiğinde (eleman eklenip silindiğinde) çalışır
  useEffect(() => {
    if (lastInputRef.current) {
      lastInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [assignees.length]);

  const handleInputChange = (index, event) => {
    const newAssignees = [...assignees];
    newAssignees[index] = event.target.value;
    onAssigneesChange(newAssignees);
  };

  const handleAddInput = () => {
    // YENİ: Fonksiyonun başında ek bir kontrol (buton disabled olsa bile)
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
            // YENİ: Sadece son elemana ref ekle
            ref={index === assignees.length - 1 ? lastInputRef : null}
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
              // YENİ: Butonu kontrol sonucuna göre devre dışı bırak
              disabled={isAddDisabled}
              // YENİ: Devre dışıyken daha anlaşılır olması için başlık ekle
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