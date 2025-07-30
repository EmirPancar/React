import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSelector } from 'react-redux';
import { useDndContext } from '@dnd-kit/core';

// YENİ: Atanan kişi rozeti bileşeni
const AssigneeBadge = ({ assignee }) => {
  if (!assignee) return null;
  const initial = assignee.charAt(0).toUpperCase();
  return <div className="assignee-badge">{initial}</div>;
};


const Task = ({ task, isSelected, onTaskClick, onOpenDetails }) => { // onOpenDetails eklendi
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

  const isMultiDragActive =
    active?.data.current?.type === 'Task' &&
    selectedTaskIds.includes(active.id) &&
    selectedTaskIds.length > 1;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging || (isMultiDragActive && selectedTaskIds.includes(task.id))) {
      style.visibility = 'hidden';
  }

  const cardClassName = isSelected ? 'task-card selected' : 'task-card';

  const handleCardClick = (e) => {
    // Sadece sürükleme değil, basit bir tıklama ise detayları aç
    if (!e.ctrlKey && !e.metaKey) {
        // Eğer bir sürükleme işlemi başlamadıysa modalı aç.
        // dnd-kit sürüklemeyi başlatmak için bir miktar fare hareketi gerektirir (distance > 0).
        // Bu yüzden bu tıklama genellikle sürüklemeden önce tetiklenir.
        onOpenDetails(task.id);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cardClassName}
      data-task-id={task.id}
      // Mevcut onMouseDown seçim için kalıyor. onClick detay için eklendi.
      onMouseDown={(e) => {
        e.stopPropagation();
        onTaskClick(e, task.id);
      }}
      onClick={handleCardClick} // YENİ
      {...attributes}
      {...listeners}
    >
      <div className="task-card-header"></div>
      {task.title}
      <AssigneeBadge assignee={task.assignee} /> {/* YENİ */}
    </div>
  );
};

export default Task;