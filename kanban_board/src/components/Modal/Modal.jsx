import React, { useState, useEffect, useRef } from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, onSave }) {
  const [noteText, setNoteText] = useState('');
  
  // Yazı alanına bir referans oluşturuyoruz.
  const textareaRef = useRef(null);

  // Bu useEffect, modal'ın görünürlüğü (isOpen) değiştiğinde çalışır.
  useEffect(() => {
    // Eğer modal açıldıysa...
    if (isOpen) {
      // Çok küçük bir gecikme ile focus() fonksiyonunu çağırıyoruz.
      // Bu, elemanın DOM'a tam olarak yerleşmesini bekleyerek daha garantili çalışmasını sağlar.
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
    }
  }, [isOpen]); // Sadece 'isOpen' değiştiğinde tekrar çalış.

  if (!isOpen) return null;

  const handleSave = () => {
    if (noteText.trim()) {
      onSave(noteText);
      setNoteText('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Yeni Not Ekle</h2>
        <textarea
          // Referansı textarea elemanına bağlıyoruz.
          ref={textareaRef}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Notunuzu buraya yazın..."
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