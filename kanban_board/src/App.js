// App.js

import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { 
    addTask, 
    deleteTask, 
    moveTask,
    moveSelectedTasks,
    deleteSelectedTasks,
    clearTaskSelection,
    addTasksToSelection
} from './redux/tasksSlice';

import Header from './components/Header/Header';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import Task from './components/KanbanBoard/Task';
import Modal from './components/Modal/Modal';
import './App.css';

// Çakışma tespiti için yardımcı fonksiyon
const areRectsColliding = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

const NewNoteDragVisual = () => <div className="task-card new-note-visual">Yeni Not...</div>;

function App() {
  const { tasks, selectedTaskIds } = useSelector(state => state);
  const dispatch = useDispatch();
  
  const [activeItem, setActiveItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [destinationColumn, setDestinationColumn] = useState(null);

  // ALAN SEÇİMİ İÇİN STATE'LER
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState(null);
  const initialMousePos = useRef({ x: 0, y: 0 });

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }));

  const findColumnForTask = (taskId) => {
    for (const columnId in tasks) {
        if (tasks[columnId].some(task => task.id === taskId)) {
            return columnId;
        }
    }
    return null;
  };

  const handleDragStart = (event) => {
    if(isSelecting) {
      event.preventDefault();
      return;
    }
    const { active } = event;
    const activeId = active.id;
    const activeIsTask = active.data.current?.type === 'Task';
    if (activeIsTask && !selectedTaskIds.includes(activeId)) {
      dispatch(clearTaskSelection());
    }
    setActiveItem(event.active);
  };
  
  const handleDragEnd = (event) => {
    // ... Bu fonksiyonun içeriği önceki haliyle aynı, değişiklik yok ...
    const { active, over } = event;
    setActiveItem(null);
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    const activeIsTask = active.data.current?.type === 'Task';
    const activeIsNewNote = activeId === 'new-task-creator';
    if (activeIsNewNote) {
      if (over.id === 'delete-area') return;
      let destColId = over.data.current?.type === 'Column' ? overId : findColumnForTask(overId);
      if (destColId) {
          setDestinationColumn(destColId);
          setModalOpen(true);
      }
      return;
    }
    if (!activeIsTask) return;
    if (over.id === 'delete-area') {
        if (selectedTaskIds.length > 0) {
            dispatch(deleteSelectedTasks());
        } else {
            const sourceColumn = findColumnForTask(activeId);
            if (sourceColumn) {
                dispatch(deleteTask({ columnId: sourceColumn, taskId: activeId }));
            }
        }
        return;
    }
    const destColumn = over.data.current?.type === 'Column' ? overId : findColumnForTask(overId);
    if (!destColumn) return;
    const isMovingSelection = selectedTaskIds.includes(activeId) && selectedTaskIds.length > 1;
    if (isMovingSelection) {
        dispatch(moveSelectedTasks({ destColumn }));
    } else {
        const sourceColumn = findColumnForTask(activeId);
        if(!sourceColumn) return;
        const sourceIndex = tasks[sourceColumn].findIndex(t => t.id === activeId);
        const destIndex = over.data.current?.type === 'Task' ? tasks[destColumn].findIndex(t => t.id === overId) : tasks[destColumn].length;
        if (sourceColumn !== destColumn || sourceIndex !== destIndex) {
            dispatch(moveTask({ sourceColumn, destColumn, sourceIndex, destIndex }));
        }
    }
  };

  const handleSaveNewTask = (title) => {
    if(destinationColumn) {
      dispatch(addTask({ columnId: destinationColumn, title }));
      setModalOpen(false);
    }
    setDestinationColumn(null);
  };

  // --- FARE OLAYLARI İÇİN FONKSİYONLAR ---
  const handleMouseDown = (e) => {
    const target = e.target;
    // Sadece kanban board'un arka planına veya bir sütunun boş alanına tıklandığında başla
    const isBackgroundClick = target.classList.contains('kanban-board') || target.classList.contains('column-tasks');
    if ((e.ctrlKey || e.metaKey) && isBackgroundClick) {
        e.preventDefault();
        e.stopPropagation();
        
        // Mevcut seçimleri temizleme, yeni seçim ekleme modu
        // dispatch(clearTaskSelection()); 
        
        setIsSelecting(true);
        initialMousePos.current = { x: e.clientX, y: e.clientY };
        setSelectionRect({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
    }
  };

  const handleMouseMove = (e) => {
    if (!isSelecting) return;
    e.preventDefault();
    e.stopPropagation();

    const currentX = e.clientX;
    const currentY = e.clientY;
    const startX = initialMousePos.current.x;
    const startY = initialMousePos.current.y;

    const x = Math.min(startX, currentX);
    const y = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    
    setSelectionRect({ x, y, width, height });
  };

  const handleMouseUp = (e) => {
    if (!isSelecting || !selectionRect) {
      // Arka plana normal tıklama (sürükleme olmadan) tüm seçimleri temizler
      const target = e.target;
      const isBackgroundClick = target.classList.contains('kanban-board') || target.classList.contains('column-tasks');
      if(isBackgroundClick && !e.ctrlKey && !e.metaKey){
          dispatch(clearTaskSelection());
      }
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const selectedIds = [];
    const taskElements = document.querySelectorAll('.task-card[data-task-id]');
    
    taskElements.forEach(taskEl => {
        const taskRect = taskEl.getBoundingClientRect();
        const taskId = taskEl.getAttribute('data-task-id');
        
        if (areRectsColliding(selectionRect, taskRect)) {
            selectedIds.push(taskId);
        }
    });

    if (selectedIds.length > 0) {
        dispatch(addTasksToSelection(selectedIds));
    }

    setIsSelecting(false);
    setSelectionRect(null);
  };
  
  return (
    <div className="app-container">
      <div className="dnd-context-wrapper">
        <DndContext 
          sensors={sensors} 
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <Header projectTitle="Proje Yönetim Panosu" />
          <KanbanBoard 
            tasks={tasks}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
          <DragOverlay dropAnimation={null}>
            {activeItem?.id === 'new-task-creator' ? <NewNoteDragVisual /> : null}
            {activeItem?.data.current?.type === 'Task' ? (
                // DragOverlay içindeki Task'in tıklanabilir olmasına gerek yok
                <Task task={activeItem.data.current.task} isSelected={false} onTaskClick={() => {}} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      
      {selectionRect && (
        <div 
            className="selection-rectangle"
            style={{
                left: selectionRect.x,
                top: selectionRect.y,
                width: selectionRect.width,
                height: selectionRect.height,
            }}
        />
      )}

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveNewTask}
      />
    </div>
  );
}

export default App;