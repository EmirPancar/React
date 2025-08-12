import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { addHabit, editHabit } from '../redux/habitsSlice';
import './AddHabitForm.css';

const AddHabitForm = ({ date, onClose, existingHabit }) => {
  const dispatch = useDispatch();
  
  const [title, setTitle] = useState(existingHabit ? existingHabit.title : '');
  const [content, setContent] = useState(existingHabit ? existingHabit.content : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const dateStr = format(date, 'yyyy-MM-dd');

    if (existingHabit) {
      dispatch(editHabit({
        date: dateStr,
        habitId: existingHabit.id,
        updatedTitle: title,
        updatedContent: content
      }));
    } else {
      dispatch(addHabit({ date: dateStr, habit: { title, content } }));
    }
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-habit-form" onClick={(e) => e.stopPropagation()}>
        <h4>{existingHabit ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Başlık</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">İçerik (Detay)</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose}>İptal</button>
            <button type="submit">{existingHabit ? 'Kaydet' : 'Oluştur'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitForm;