import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Task from './Task';

// forwardRef kaldırıldı, artık gerekli değil.
const Column = ({ id, title, tasks }) => {
  const { setNodeRef } = useDroppable({
    id,
    data: { type: 'Column' }
  });

  return (
    <div className="kanban-column">
      <h2 className="column-title">{title}</h2>
      {/* SortableContext, görevlerin bu sütun içinde sıralanabilmesini sağlar */}
      <SortableContext 
        id={id} 
        items={tasks.map(t => t.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="column-tasks">
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default Column;