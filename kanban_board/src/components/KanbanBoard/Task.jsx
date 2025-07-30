import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSelector } from 'react-redux';
import { useDndContext } from '@dnd-kit/core';

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

  const { active } = useDndContext();
  const selectedTaskIds = useSelector(state => state.selectedTaskIds);

  // Çoklu sürüklemenin aktif olup olmadığını kontrol et
  const isMultiDragActive =
    active?.data.current?.type === 'Task' &&
    selectedTaskIds.includes(active.id) &&
    selectedTaskIds.length > 1;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Bir kart şu durumlarda gizlenmelidir:
  // 1. Fiziksel olarak sürüklenen kartın kendisiyse (isDragging).
  // 2. Fiziksel olarak sürüklenmiyor ama aktif bir çoklu sürüklemenin parçasıysa.
  if (isDragging || (isMultiDragActive && selectedTaskIds.includes(task.id))) {
      style.visibility = 'hidden';
  }

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