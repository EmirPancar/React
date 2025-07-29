import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// useDraggable'dan useSortable'a geri dönüldü.
const Task = ({ task, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    data: { task, type: 'Task' } // Data'yı basitleştirdik
  });

  // Stil, artık mutlak konumlandırma İÇERMİYOR.
  // Sadece sürükleme animasyonu için transform kullanıyor.
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1, // Saydamlığı biraz düşürdük
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="task-card">
      <div className="task-card-header"></div>
      {task.title}
    </div>
  );
};

export default Task;