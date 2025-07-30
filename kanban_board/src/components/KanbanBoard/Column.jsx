// components/KanbanBoard/Column.js

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTaskSelection } from '../../redux/tasksSlice';
import Task from './Task';

const Column = ({ id, title, tasks }) => {
  const dispatch = useDispatch();
  const selectedTaskIds = useSelector(state => state.selectedTaskIds);

  const { setNodeRef } = useDroppable({
    id,
    data: { type: 'Column' }
  });

  // Tıklama olayını yönetecek fonksiyon
  const handleTaskClick = (e, taskId) => {
    // KRİTİK DÜZELTME:
    // preventDefault ve stopPropagation kaldırıldı. Bu sayede fare olayı
    // dnd-kit'in sürükleme sensörlerine ulaşabilir. dnd-kit,
    // tıklama ve sürükleme arasındaki farkı ayırt edecek kadar akıllıdır.
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
              // onTaskClick prop'u olarak fonksiyonu Task bileşenine gönderiyoruz.
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default Column;