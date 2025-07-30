import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import './HeaderStyle.css';

const CreateNote = () => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: 'new-task-creator',
  });

  return (
    <div className="create-note-stack" ref={setNodeRef} {...listeners} {...attributes}>
        <div className="note-stack-item note1"></div>
        <div className="note-stack-item note2"></div>
        <div className="note-stack-item note3">Sürükle & Bırak</div>
    </div>
  );
};

const DeleteArea = () => {
    const {isOver, setNodeRef} = useDroppable({
        id: 'delete-area',
    });

    return (
        <div ref={setNodeRef} className={`up-delete ${isOver ? 'is-over' : ''}`}>
             🗑️ Buraya Sürükle ve Sil
        </div>
    );
};

function Header({ projectTitle }) {
    return (
        <div className="up-body">
            <CreateNote />
            <div className='up-title'><h1>{projectTitle}</h1></div>
            <DeleteArea />
        </div>
    );
}

export default Header;