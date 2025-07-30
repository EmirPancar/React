import React from 'react';
import Column from './Column';
import './KanbanBoardStyle.css';

const KanbanBoard = ({ tasks, onMouseDown, onMouseMove, onMouseUp, onOpenTaskDetails, assigneeStyles }) => {
  const columnTitles = {
    'bekliyor': 'Bekliyor/Planlandı',
    'yapiliyor': 'Yapılıyor',
    'test': 'Test Ediliyor',
    'geribildirim': 'Geri Bildirim Bekleniyor',
    'tamamlandi': 'Tamamlandı'
  };

  return (
    <div 
      className="kanban-board"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {Object.keys(columnTitles).map(columnId => (
        <Column
          key={columnId}
          id={columnId}
          title={columnTitles[columnId]}
          tasks={tasks[columnId] || []}
          onOpenTaskDetails={onOpenTaskDetails}
          // Burası doğru, 'assigneeStyles' prop'unu iletiyor.
          assigneeStyles={assigneeStyles}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;