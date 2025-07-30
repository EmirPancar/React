import React from 'react';
import Column from './Column';
import './KanbanBoardStyle.css';

const KanbanBoard = ({ tasks, onMouseDown, onMouseMove, onMouseUp, onOpenTaskDetails }) => {
  // Kolon ID'lerini ve başlıklarını eşleştiren bir nesne.
  // Bu, backend'den veya bir konfigürasyon dosyasından da gelebilir.
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
      // Bu olay dinleyicileri, (Ctrl/Cmd + Mouse) ile alan seçimi (selection rectangle)
      // özelliğini etkinleştirmek için App.js'den geliyor.
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* 
        columnTitles nesnesinin anahtarları (key'leri) üzerinden dönerek
        her bir kolon için bir <Column> bileşeni oluşturuyoruz.
      */}
      {Object.keys(columnTitles).map(columnId => (
        <Column
          key={columnId}
          id={columnId}
          title={columnTitles[columnId]}
          // tasks state'inden o anki kolona ait görev dizisini alıyoruz.
          // Eğer o kolonda hiç görev yoksa, boş bir dizi (`[]`) göndererek hatayı önlüyoruz.
          tasks={tasks[columnId] || []}
          // App.js'den gelen görev detayı modal'ını açma fonksiyonunu
          // doğrudan Column bileşenine iletiyoruz.
          onOpenTaskDetails={onOpenTaskDetails}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;