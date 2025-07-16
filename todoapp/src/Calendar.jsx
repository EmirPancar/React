import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import tr from 'date-fns/locale/tr';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'tr-TR': tr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const tasks = useSelector(state => state.task.tasks);
  const [currentDate, setCurrentDate] = useState(new Date());

  const events = tasks.map(task => ({
    title: task.title,
    start: new Date(task.date),
    end: new Date(task.date),
    allDay: true,
    resource: {
      important: task.important,
      completed: task.completed,
      past: new Date(task.date) < new Date()
    }
  }));

  const eventStyleGetter = (event) => {
    let backgroundColor = '#4b6587';
    let fontFamily = "'Nunito', sans-serif";

    if (event.resource.completed) backgroundColor = '#27ae60';
    else if (event.resource.important) backgroundColor = '#f1c40f';
    else if (event.resource.past) backgroundColor = '#7f8c8d';

    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '6px',
        padding: '4px',
        fontFamily,
        fontWeight: 'bold',
      }
    };
  };

  const handleNavigate = (action) => {
    const newDate = new Date(currentDate);
    if (action === 'PREV') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (action === 'NEXT') {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const monthYearLabel = format(currentDate, "MMMM yyyy", { locale: tr });

  return (
    <div className='CalendarContainer'>
      <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <button onClick={() => handleNavigate('PREV')} className='CalendarButton'>← Önceki Ay</button>
        <h2 style={{ fontFamily: 'Nunito, sans-serif' }}>{monthYearLabel}</h2>
        <button onClick={() => handleNavigate('NEXT')} className='CalendarButton'>Sonraki Ay →</button>
      </div>

      <div style={{ height: '420px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={{ month: true }}
          defaultView={Views.MONTH}
          date={currentDate}
          onNavigate={() => {}}
          eventPropGetter={eventStyleGetter}
          toolbar={false}
          culture='tr-TR'
          popup={true}
        />
      </div>
    </div>
  );
}
