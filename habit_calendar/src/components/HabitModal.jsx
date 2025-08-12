import React, { useState, useMemo } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { selectHabitsForDate, toggleHabit, deleteHabit } from '../redux/habitsSlice';
import AddHabitForm from './AddHabitForm';
import ColorPicker from './ColorPicker';
import './HabitModal.css';

const HabitModal = ({ date, onClose }) => {
  const dispatch = useDispatch();
  const dateStr = format(date, 'yyyy-MM-dd');
  const habits = useSelector(state => selectHabitsForDate(state, dateStr));
  
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isPickingColor, setIsPickingColor] = useState(false);
  const [detailedHabit, setDetailedHabit] = useState(null);

  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => a.completed - b.completed);
  }, [habits]);

  const handleToggleHabit = (e, habitId) => {
    e.stopPropagation(); 
    dispatch(toggleHabit({ date: dateStr, habitId }));
  };

  const handleDeleteHabit = (e, habitId) => {
    e.stopPropagation();
    dispatch(deleteHabit({ date: dateStr, habitId }));
  };
  
  const handleEditClick = (e, habit) => {
    e.stopPropagation();
    setEditingHabit(habit);
  };
  
  const closeForms = () => {
      setIsAddingHabit(false);
      setEditingHabit(null);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{format(date, 'dd MMMM yyyy', { locale: tr })}</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        <div className="modal-body">
          {detailedHabit ? (
            <div className="habit-detail-view">
               <h4>{detailedHabit.title}</h4>
               <p className="habit-content-text">{detailedHabit.content || "Bu görev için detay eklenmemiş."}</p>
               <button onClick={() => setDetailedHabit(null)} className="back-button">Geri Dön</button>
            </div>
          ) : (
            <div className="habits-list">
              {sortedHabits.length === 0 && <p className="no-habits-message">Bugün için görev yok.</p>}
              {sortedHabits.map(habit => (
                <div 
                  key={habit.id} 
                  className={`habit-item ${habit.completed ? 'completed' : ''}`}
                  onClick={() => setDetailedHabit(habit)}
                >
                  <span className="habit-title">{habit.title}</span>
                  <div className="habit-actions">
                    <button
                        className="edit-button"
                        onClick={(e) => handleEditClick(e, habit)}
                        title="Görevi düzenle"
                    >
                        ✎
                    </button>
                    <button 
                      className="tick-button"
                      onClick={(e) => handleToggleHabit(e, habit.id)}
                      title="Görevi tamamla"
                    >
                      ✓
                    </button>
                    <button 
                      className="delete-button"
                      onClick={(e) => handleDeleteHabit(e, habit.id)}
                      title="Görevi sil"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={() => setIsAddingHabit(true)}>Görev Oluştur</button>
          <button onClick={() => setIsPickingColor(true)}>Renk Seç</button>
        </div>
      </div>
      
      {(isAddingHabit || editingHabit) && (
        <AddHabitForm 
          date={date} 
          onClose={closeForms}
          existingHabit={editingHabit} 
        />
      )}
      {isPickingColor && ( <ColorPicker date={date} onClose={() => setIsPickingColor(false)} /> )}
    </div>
  );
};

export default HabitModal;