import React, { useState, useRef, useEffect } from 'react';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay
} from 'date-fns';
import { tr } from 'date-fns/locale';
import './Calendar.css';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [highlightStyle, setHighlightStyle] = useState({ opacity: 0 });
  const [selectionStyle, setSelectionStyle] = useState({ opacity: 0 });
  const gridRef = useRef(null);
  const today = new Date();

  // Bu useEffect, seçili gün değiştiğinde MAVİ çerçevenin konumunu günceller
  useEffect(() => {
    // Eğer seçilen gün "bugün" ise, mavi çerçeveyi gösterme.
    if (isSameDay(selectedDate, today)) {
      setSelectionStyle({ opacity: 0 });
      return;
    }

    // Seçilen günü DOM'da bul
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const selectedCell = gridRef.current?.querySelector(`.day-cell[data-date="${dateString}"]`);

    if (selectedCell) {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = selectedCell;
      setSelectionStyle({
        opacity: 1,
        width: `${offsetWidth}px`,
        height: `${offsetHeight}px`,
        transform: `translate(${offsetLeft}px, ${offsetTop}px)`,
      });
    }
  }, [selectedDate, today]); // selectedDate değiştiğinde bu kod yeniden çalışır


  const handleMouseMove = (e) => {
    if (!gridRef.current) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const mouseX = e.clientX - gridRect.left;
    const mouseY = e.clientY - gridRect.top;
    
    // 1. Maskenin konumunu anlık olarak güncelle
    gridRef.current.style.setProperty('--mouse-x', `${mouseX}px`);
    gridRef.current.style.setProperty('--mouse-y', `${mouseY}px`);
    
    const cell = e.target.closest('.day-cell');
    
    // İmleç seçili olan günün üzerindeyse, hover efektini gösterme
    if (cell && cell.dataset.date !== format(selectedDate, 'yyyy-MM-dd')) {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = cell;
      setHighlightStyle({
        opacity: 1,
        width: `${offsetWidth}px`,
        height: `${offsetHeight}px`,
        transform: `translate(${offsetLeft}px, ${offsetTop}px)`,
      });
    } else {
      // İmleç bir hücre üzerinde değilse veya seçili hücre üzerindeyse vurguyu gizle
      setHighlightStyle({ opacity: 0 });
    }
  };

  const handleMouseLeave = () => {
    // İmleç grid'den ayrılınca hem maskeyi hem vurguyu gizle
    if (gridRef.current) {
      gridRef.current.style.setProperty('--mouse-x', `-9999px`);
      gridRef.current.style.setProperty('--mouse-y', `-9999px`);
    }
    setHighlightStyle({ opacity: 0 });
  };

  const renderHeader = () => (
    <div className="calendar-header">
      <div className="current-month">{format(currentMonth, 'MMMM yyyy', { locale: tr })}</div>
      <div className="nav-buttons">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} aria-label="Önceki ay">‹</button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} aria-label="Sonraki ay">›</button>
      </div>
    </div>
  );

  const renderWeekDays = () => {
    const days = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'];
    return <div className="calendar-grid">{days.map(day => <div key={day} className="week-day">{day}</div>)}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 41);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div ref={gridRef} className="calendar-grid" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        {/* KATMAN 1: Maskeli, soluk çerçeveler */}
        <div className="border-overlay">
          <div className="border-grid">
            {Array.from({ length: 42 }).map((_, index) => <div key={index}></div>)}
          </div>
        </div>
        
        {/* KATMAN 2: Fareyi takip eden gri vurgu çerçevesi */}
        <div className="highlight-border" style={highlightStyle}></div>

        {/* KATMAN 3: Başka bir gün seçiliyken gösterilecek kalıcı MAVİ çerçeve */}
        <div className="selection-border" style={selectionStyle}></div>

        {/* KATMAN 4: Tıklanabilir, görünür hücreler */}
        {days.map((day) => {
          const classNames = [
            'day-cell',
            isSameDay(day, today) && 'is-today',
            isSameDay(day, selectedDate) && 'is-selected',
            !isSameMonth(day, monthStart) && 'not-current-month',
          ].filter(Boolean).join(' ');

          return (
            <div
              key={day.toString()}
              className={classNames}
              data-date={format(day, 'yyyy-MM-dd')}
              onClick={() => setSelectedDate(day)}
            >
              <span>{format(day, 'd')}</span>
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
    </div>
  );
};

export default Calendar;