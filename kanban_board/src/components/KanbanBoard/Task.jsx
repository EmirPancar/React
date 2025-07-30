import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Task = ({ task, isSelected, onTaskClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { task, type: 'Task' }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cardClassName = isSelected ? 'task-card selected' : 'task-card';

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cardClassName}
      data-task-id={task.id}
      onMouseDown={(e) => {
        e.stopPropagation();
        onTaskClick(e, task.id);
      }}
      {...attributes}
      {...listeners}
    >
      <div className="task-card-header"></div>
      {task.title}
    </div>
  );
};

export default Task;