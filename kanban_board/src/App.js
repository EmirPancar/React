import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { addTask, deleteTask, moveTask } from './redux/tasksSlice';

import Header from './components/Header/Header';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import Task from './components/KanbanBoard/Task';
import Modal from './components/Modal/Modal';
import './App.css';

const NewNoteDragVisual = () => <div className="task-card new-note-visual">Yeni Not...</div>;

function App() {
  const tasks = useSelector(state => state);
  const dispatch = useDispatch();
  
  const [activeItem, setActiveItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [destinationColumn, setDestinationColumn] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event) => {
    setActiveItem(event.active);
  };

  // Verilen bir task ID'sinin hangi sütunda olduğunu bulan yardımcı fonksiyon
  const findColumnForTask = (taskId) => {
    for (const columnId in tasks) {
        if (tasks[columnId].some(task => task.id === taskId)) {
            return columnId;
        }
    }
    return null;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    // ----- YENİ NOT OLUŞTURMA MANTIĞI (GÜNCELLENDİ) -----
    // Eğer sürüklenen şey "yeni not" bloğu ise...
    if (active.id === 'new-task-creator') {
      let destColId = null;

      // Eğer boş bir sütunun üzerine bırakıldıysa...
      if (over.data.current?.type === 'Column') {
        destColId = over.id;
      } 
      // VEYA dolu bir sütundaki bir görevin üzerine bırakıldıysa...
      else if (over.data.current?.type === 'Task') {
        // O görevin ait olduğu sütunu bul.
        destColId = findColumnForTask(over.id);
      }

      // Eğer bir hedef sütun bulunduysa modalı aç.
      if (destColId) {
        setDestinationColumn(destColId);
        setModalOpen(true);
      }
      return; // Bu işlem bitti, fonksiyonun devamına gitme.
    }

    // ----- MEVCUT GÖREVLERİ TAŞIMA MANTIĞI (AYNI KALDI) -----
    const isActiveTask = active.data.current?.type === 'Task';

    // Not silme
    if (isActiveTask && over.id === 'delete-area') {
      const sourceColumn = findColumnForTask(active.id);
      if (sourceColumn) {
        dispatch(deleteTask({ columnId: sourceColumn, taskId: active.id }));
      }
      return;
    }

    // Görev Taşıma ve Sıralama
    const isOverColumn = over.data.current?.type === 'Column';
    const isOverTask = over.data.current?.type === 'Task';

    if (isActiveTask && (isOverColumn || isOverTask)) {
      const sourceColumn = findColumnForTask(active.id);
      const destColumn = isOverTask ? findColumnForTask(over.id) : over.id;
      
      const sourceIndex = tasks[sourceColumn].findIndex(t => t.id === active.id);
      const destIndex = isOverTask ? tasks[destColumn].findIndex(t => t.id === over.id) : tasks[destColumn].length;

      if (sourceColumn !== destColumn || sourceIndex !== destIndex) {
        dispatch(moveTask({ sourceColumn, destColumn, sourceIndex, destIndex }));
      }
    }
  };

  const handleSaveNewTask = (title) => {
    if(destinationColumn) {
      dispatch(addTask({ columnId: destinationColumn, title }));
    }
    setDestinationColumn(null); // İşlem sonrası sıfırla
  };

  return (
    <div className="app-container">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Header projectTitle="Proje Yönetim Panosu" />
        <KanbanBoard tasks={tasks} />
        <DragOverlay dropAnimation={null}>
          {activeItem?.id === 'new-task-creator' ? <NewNoteDragVisual /> : null}
          {activeItem?.data.current?.type === 'Task' ? <Task task={activeItem.data.current.task} isDragging /> : null}
        </DragOverlay>
      </DndContext>
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveNewTask}
      />
    </div>
  );
}

export default App;