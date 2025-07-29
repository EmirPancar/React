import React, { useState, useEffect, useRef } from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, onSave }) {
  const [noteText, setNoteText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Modal açıldığında, imlecin yazı kutusuna gelmesini sağlar.
      // setTimeout, elemanın DOM'a tam yerleşmesini bekleyerek focus'u garantiler.
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50); // Küçük bir gecikme yeterlidir.
    } else {
      // Modal kapandığında metni temizle.
      setNoteText('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (noteText.trim()) {
      onSave(noteText);
    }
  };

  // Enter tuşuna basıldığında kaydetmek için.
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Yeni Not Ekle</h2>
        <textarea
          ref={textareaRef}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Notunuzu buraya yazın... (Kaydetmek için Enter'a basın)"
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