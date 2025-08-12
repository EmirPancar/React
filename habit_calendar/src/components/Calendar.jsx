import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  format, addMonths, subMonths, startOfMonth,
  startOfWeek, eachDayOfInterval, isSameMonth, isSameDay
} from 'date-fns';
import { tr } from 'date-fns/locale';
import HabitModal from './HabitModal';
import './Calendar.css';

const today = new Date();

const getContrastColor = (hexColor) => {
  if (!hexColor) return '#f0f0f0';
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#1c1c1c' : '#f0f0f0';
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectionStyle, setSelectionStyle] = useState({ opacity: 0 });

  const gridRef = useRef(null);
  const highlightRef = useRef(null);
  
  const colorsByDate = useSelector(state => state.habits.colorsByDate);
  const habitsByDate = useSelector(state => state.habits.habitsByDate);

  const selectedDateStr = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);

  const handleDayClick = (day) => {
      if (!isSameMonth(day, currentMonth)) {
          return;
      }
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const renderHeader = () => (
    <div className="calendar-header">
      <div className="current-month">
        {format(currentMonth, 'MMMM yyyy', { locale: tr })}
      </div>
      <div className="nav-buttons">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} aria-label="Önceki ay">‹</button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} aria-label="Sonraki ay">›</button>
      </div>
    </div>
  );

  const renderWeekDays = () => {
    const days = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'];
    return (
      <div className="calendar-grid">
        {days.map(day => <div key={day} className="week-day">{day}</div>)}
      </div>
    );
  };

  const daysInGrid = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 41);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);

    return (
      <div ref={gridRef} className="calendar-grid">
        <div ref={highlightRef} className="highlight-border"></div>
        <div className="selection-border" style={selectionStyle}></div>

        {daysInGrid.map((day) => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const dayColor = colorsByDate[dayStr];
          const textColor = getContrastColor(dayColor);

          const habitsForDay = habitsByDate[dayStr] || [];
          const areAllTasksCompleted = habitsForDay.length > 0 && habitsForDay.every(h => h.completed);

          const classNames = [
            'day-cell',
            isSameDay(day, today) && 'is-today',
            isSameDay(day, selectedDate) && 'is-selected',
            !isSameMonth(day, monthStart) && 'not-current-month',
            isSameDay(day, today) && !dayColor && 'is-today-color'
          ].filter(Boolean).join(' ');

          return (
            <div
              key={day.toString()}
              className={classNames}
              data-date={dayStr}
              onClick={() => handleDayClick(day)}
              style={{ 
                backgroundColor: dayColor, 
                color: isSameDay(day, today) && !dayColor ? 'black' : textColor 
              }}
            >
              <span>{format(day, 'd')}</span>
              {areAllTasksCompleted && <div className="all-done-tick">✓</div>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      {renderHeader()}
      {renderWeekDays()}
      {renderCells()}
      {isModalOpen && (
        <HabitModal 
          date={selectedDate} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Calendar;