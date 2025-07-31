import React, { useState, useEffect, useRef } from 'react';
import AssigneeInputManager from './AssigneeInputManager'; 
import './Modal.css';

function Modal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [assignees, setAssignees] = useState(['']);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    } else {
      setTitle('');
      setAssignees(['']);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (title.trim()) {
      const finalAssignees = assignees.filter(a => a.trim() !== '');
      onSave({ title, assignee: finalAssignees });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Yeni Not Ekle</h2>
        <textarea
          ref={textareaRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Görevi buraya yazın..."
        />
        <AssigneeInputManager
          assignees={assignees}
          onAssigneesChange={setAssignees}
        />
        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">İptal</button>
          <button onClick={handleSave} className="btn-save">Kaydet</button>
        </div>
      </div>
    </div>
  );
}
export default Modal;