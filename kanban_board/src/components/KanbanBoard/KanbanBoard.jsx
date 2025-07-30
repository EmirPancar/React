// components/KanbanBoard/KanbanBoard.js

import React from 'react';
import Column from './Column';
import './KanbanBoardStyle.css';

// DÜZELTME: Alan seçimi için fare olayı dinleyicilerini App.js'den alacak
const KanbanBoard = ({ tasks, onMouseDown, onMouseMove, onMouseUp }) => {
  const columnTitles = {
    'bekliyor': 'Bekliyor/Planlandı', 'yapiliyor': 'Yapılıyor',
    'test': 'Test Ediliyor', 'geribildirim': 'Geri Bildirim Bekleniyor', 'tamamlandi': 'Tamamlandı'
  };

  return (
    // Fare olaylarını burada dinliyoruz.
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
          tasks={tasks[columnId] || []} // Sütun boşsa hata vermemesi için
        />
      ))}
    </div>
  );
};

export default KanbanBoard;