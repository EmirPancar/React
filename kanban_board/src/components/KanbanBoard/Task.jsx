import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Task = ({ task, isDragging, isSelected, onTaskClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
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
    // 'onMouseDown' olayını kullanarak, sürükleme başlamadan hemen önce tıklamayı yakalıyoruz.
    // Bu, dnd-kit'in 'onClick' olayını yutmasını engeller.
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cardClassName}
      onMouseDown={(e) => onTaskClick(e, task.id)}
      {...attributes}
      {...listeners}
    >
      <div className="task-card-header"></div>
      {task.title}
    </div>
  );
};

export default Task