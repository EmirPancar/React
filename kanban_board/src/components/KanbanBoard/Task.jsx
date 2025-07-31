import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSelector } from 'react-redux';
import { useDndContext } from '@dnd-kit/core';
import { getTextColorForBackground } from '../../utils/colorUtils';

const AssigneeBadge = ({ styleInfo }) => {
  if (!styleInfo) return null;

  const { color, initials } = styleInfo;
  const textColor = getTextColorForBackground(color);

  return (
    <div 
        className="assignee-badge" 
        style={{ 
            backgroundColor: color, 
            color: textColor 
        }}
    >
        {initials}
    </div>
  );
};

const Task = ({ task, isSelected, onTaskClick, onOpenDetails, assigneeStyles = new Map() }) => {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
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
    if (!e.ctrlKey && !e.metaKey && !isDragging) {
        onOpenDetails(task.id);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cardClassName}
      data-task-id={task.id}
      onMouseDown={(e) => { e.stopPropagation(); onTaskClick(e, task.id); }}
      onClick={handleCardClick}
      {...attributes}
      {...listeners}
    >
      <div className="task-card-header"></div>
      
      <div className="task-title-content">
        {task.title}
      </div>
      
      <div className="assignee-badges-container">
        {task.assignee && task.assignee.map(name => {
          const styleInfo = assigneeStyles.get(name);
          return <AssigneeBadge key={name} styleInfo={styleInfo} />;
        })}
      </div>
    </div>
  );
};

export default Task;