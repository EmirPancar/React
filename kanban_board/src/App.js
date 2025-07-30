import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { 
    addTask, 
    deleteTask, 
    moveTask,
    moveSelectedTasks,
    clearTaskSelection,
    deleteSelectedTasks
} from './redux/tasksSlice';

import Header from './components/Header/Header';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import Task from './components/KanbanBoard/Task';
import Modal from './components/Modal/Modal';
import './App.css'; 

const NewNoteDragVisual = () => <div className="task-card new-note-visual">Yeni Not...</div>;

function App() {
  const { tasks, selectedTaskIds } = useSelector(state => state);
  const dispatch = useDispatch();
  
  const [activeItem, setActiveItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [destinationColumn, setDestinationColumn] = useState(null);

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
    const { active } = event;
    const activeId = active.id;
    const activeIsTask = active.data.current?.type === 'Task';

    if (activeIsTask && !selectedTaskIds.includes(activeId)) {
      dispatch(clearTaskSelection());
    }
    
    setActiveItem(event.active);
  };
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    const activeIsTask = active.data.current?.type === 'Task';
    const activeIsNewNote = activeId === 'new-task-creator';

    if (activeIsNewNote) {
      if (over.id === 'delete-area') return;
      let destColId = over.data.current?.type === 'Column' 
          ? overId 
          : findColumnForTask(overId);

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
    
    const destColumn = over.data.current?.type === 'Column' 
        ? overId 
        : findColumnForTask(overId);
        
    if (!destColumn) return;

    const isMovingSelection = selectedTaskIds.includes(activeId);

    if (isMovingSelection && selectedTaskIds.length > 1) {
        dispatch(moveSelectedTasks({ destColumn }));
    } else {
        const sourceColumn = findColumnForTask(activeId);
        if(!sourceColumn) return;
        const sourceIndex = tasks[sourceColumn].findIndex(t => t.id === activeId);
        const destIndex = over.data.current?.type === 'Task' 
            ? tasks[destColumn].findIndex(t => t.id === overId) 
            : tasks[destColumn].length;

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
  

  return (
    <div className="app-container" onClick={() => dispatch(clearTaskSelection())}>
      <div 
        className="dnd-context-wrapper" 
        onClick={(e) => e.stopPropagation()}
      >
        <DndContext 
          sensors={sensors} 
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <Header projectTitle="Proje Yönetim Panosu" />
          <KanbanBoard tasks={tasks} />
          
          <DragOverlay dropAnimation={null}>
            {activeItem?.id === 'new-task-creator' ? <NewNoteDragVisual /> : null}
            {activeItem?.data.current?.type === 'Task' ? <Task task={activeItem.data.current.task} isDragging /> : null}
          </DragOverlay>

        </DndContext>
      </div>

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveNewTask}
      />
    </div>
  );
}

export default App;