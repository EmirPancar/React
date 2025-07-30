import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTaskSelection } from '../../redux/tasksSlice';
import Task from './Task';

const Column = ({ id, title, tasks, onOpenTaskDetails }) => {
  const dispatch = useDispatch();
  const selectedTaskIds = useSelector(state => state.selectedTaskIds);

  const { setNodeRef } = useDroppable({
    id,
    data: { type: 'Column' }
  });

  // Ctrl/Cmd tuşu ile çoklu seçim yapmayı sağlayan fonksiyon
  const handleTaskClick = (e, taskId) => {
    if (e.ctrlKey || e.metaKey) {
        dispatch(toggleTaskSelection(taskId));
    }
  };

  return (
    <div className="kanban-column">
      <h2 className="column-title">{title}</h2>
      <SortableContext 
        id={id} 
        items={tasks.map(t => t.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="column-tasks">
          {tasks.map((task) => (
            <Task 
              key={task.id} 
              task={task}
              isSelected={selectedTaskIds.includes(task.id)}
              onTaskClick={handleTaskClick}
              onOpenDetails={onOpenTaskDetails} // App.js'den gelen fonksiyonu Task bileşenine iletiyoruz
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default Column;