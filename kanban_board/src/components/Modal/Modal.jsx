import React, { useState, useEffect, useRef } from 'react';
import './Modal.css'; // Stil dosyasını birazdan güncelleyeceğiz
function Modal({ isOpen, onClose, onSave }) {
// State'i bir nesne olarak değiştirelim
const [taskData, setTaskData] = useState({ title: '', assignee: '' });
const textareaRef = useRef(null);
useEffect(() => {
if (isOpen) {
setTimeout(() => {
textareaRef.current?.focus();
}, 50);
} else {
// Kapanınca formu sıfırla
setTaskData({ title: '', assignee: '' });
}
}, [isOpen]);
if (!isOpen) return null;
const handleChange = (e) => {
const { name, value } = e.target;
setTaskData(prev => ({ ...prev, [name]: value }));
};
const handleSave = () => {
// Sadece başlık zorunlu olsun
if (taskData.title.trim()) {
onSave(taskData);
}
};
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
name="title" // name eklendi
value={taskData.title}
onChange={handleChange}
onKeyDown={handleKeyDown}
placeholder="Görevi buraya yazın..."
/>
{/* YENİ: Atanan kişi input'u */}
<input
type="text"
name="assignee" // name eklendi
value={taskData.assignee}
onChange={handleChange}
onKeyDown={handleKeyDown}
className="modal-input" // Stil için class
placeholder="Atanan Kişi"
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