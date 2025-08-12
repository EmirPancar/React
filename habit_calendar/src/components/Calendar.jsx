import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  format, addMonths, subMonths, startOfMonth,
  startOfWeek, eachDayOfInterval, isSameMonth, isSameDay
} from 'date-fns';
import { tr } from 'date-fns/locale';
import './Calendar.css';

const today = new Date();

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectionStyle, setSelectionStyle] = useState({ opacity: 0 });

  const gridRef = useRef(null);
  const highlightRef = useRef(null);
  const rafIdRef = useRef(null);
  const gridRectRef = useRef(null);

  // Seçili tarih string cache
  const selectedDateStr = useMemo(
    () => format(selectedDate, 'yyyy-MM-dd'),
    [selectedDate]
  );

  // Grid ölçülerini cache
  useEffect(() => {
    if (gridRef.current) {
      gridRectRef.current = gridRef.current.getBoundingClientRect();
    }
    const handleResize = () => {
      if (gridRef.current) {
        gridRectRef.current = gridRef.current.getBoundingClientRect();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Seçili gün vurgusu
  useEffect(() => {
    if (isSameDay(selectedDate, today)) {
      setSelectionStyle({ opacity: 0 });
      return;
    }
    if (!gridRef.current) return;

    const selectedCell = gridRef.current.querySelector(
      `.day-cell[data-date="${selectedDateStr}"]`
    );
    if (selectedCell) {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = selectedCell;
      setSelectionStyle({
        opacity: 1,
        width: `${offsetWidth}px`,
        height: `${offsetHeight}px`,
        transform: `translate(${offsetLeft}px, ${offsetTop}px)`,
      });
    }
  }, [selectedDate, selectedDateStr]);

  // Mouse hareketi optimize ve güvenli
  const handleMouseMove = (e) => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    rafIdRef.current = requestAnimationFrame(() => {
      const highlightEl = highlightRef.current;

      if (!highlightEl || !gridRectRef.current) return;

      const cell = e.target.closest('.day-cell');
      if (cell && cell.dataset.date !== selectedDateStr) {
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = cell;
        highlightEl.style.opacity = '1';
        highlightEl.style.width = `${offsetWidth}px`;
        highlightEl.style.height = `${offsetHeight}px`;
        highlightEl.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
      } else {
        highlightEl.style.opacity = '0';
      }
    });
  };

  const handleMouseLeave = () => {
    if (highlightRef.current) {
      highlightRef.current.style.opacity = '0';
    }
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

  // Ay günlerini cache
  const daysInGrid = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 41); // 42 gün
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);

    return (
      <div
        ref={gridRef}
        className="calendar-grid"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={highlightRef} className="highlight-border"></div>
        <div className="selection-border" style={selectionStyle}></div>

        {daysInGrid.map((day) => {
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