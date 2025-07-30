// components/KanbanBoard/Task.js

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
    isDragging, // isDragging'i useSortable'dan alıyoruz
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
      // DÜZELTME: Tıklama olayını buraya ekliyoruz.
      onMouseDown={(e) => {
        // Olayın yayılmasını durdurarak, arka plandaki seçim temizleme
        // veya alan seçimi gibi olayların tetiklenmesini engelliyoruz.
        e.stopPropagation();
        onTaskClick(e, task.id);
      }}
      // Sürükleme için gerekli olan dnd-kit özelliklerini ekliyoruz.
      {...attributes}
      {...listeners}
    >
      <div className="task-card-header"></div>
      {task.title}
    </div>
  );
};

export default Task;