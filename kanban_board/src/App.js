import React, { useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import {
    addTask, deleteTask, moveTask, updateTask, moveSelectedTasks,
    deleteSelectedTasks, clearTaskSelection, addTasksToSelection
} from './redux/tasksSlice';
import { PALETTE, simpleHash } from './utils/colorUtils';

import Header from './components/Header/Header';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import Task from './components/KanbanBoard/Task';
import Modal from './components/Modal/Modal';
import TaskDetailModal from './components/Modal/TaskDetailModal';
import './App.css';

const areRectsColliding = (rect1, rect2) => (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
);

const NewNoteDragVisual = () => <div className="task-card new-note-visual">Yeni Not...</div>;

function App() {
    const { tasks, selectedTaskIds } = useSelector(state => state);
    const dispatch = useDispatch();
    const [activeItem, setActiveItem] = useState(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [destinationColumn, setDestinationColumn] = useState(null);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [activeTask, setActiveTask] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionRect, setSelectionRect] = useState(null);
    const initialMousePos = useRef({ x: 0, y: 0 });
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const assigneeStyles = useMemo(() => {
        const styles = new Map();
        const assignedColors = new Set();
        const allAssigneeNames = Object.values(tasks).flat().flatMap(t => t.assignee).filter(Boolean);
        const uniqueNames = [...new Set(allAssigneeNames)];
        
        const namesByInitial = {};
        uniqueNames.forEach(name => {
            const initial = name.charAt(0).toUpperCase();
            if (!namesByInitial[initial]) namesByInitial[initial] = [];
            namesByInitial[initial].push(name);
        });
        const conflictingInitials = new Set();
        Object.keys(namesByInitial).forEach(initial => {
            if (namesByInitial[initial].length > 1) conflictingInitials.add(initial);
        });
        uniqueNames.forEach(name => {
            const firstInitial = name.charAt(0).toUpperCase();
            const needsTwoInitials = conflictingInitials.has(firstInitial);

            const initials = (needsTwoInitials && name.length > 1) 
                ? `${name.charAt(0).toUpperCase()}${name.charAt(1).toLowerCase()}` 
                : firstInitial;

            let color, hashIndex = simpleHash(name) % PALETTE.length;
            while (true) {
                const potentialColor = PALETTE[hashIndex];
                if (!assignedColors.has(potentialColor)) {
                    color = potentialColor;
                    assignedColors.add(color);
                    break;
                }
                hashIndex = (hashIndex + 1) % PALETTE.length;
            }
            styles.set(name, { color, initials });
        });
        return styles;
    }, [tasks]);

    const findColumnForTask = (taskId) => {
        for (const columnId in tasks) if (tasks[columnId].some(t => t.id === taskId)) return columnId;
        return null;
    };
    const getTaskById = (taskId) => {
        for (const column in tasks) {
            const task = tasks[column].find(t => t.id === taskId);
            if (task) return task;
        }
        return null;
    };
    const getTasksByIds = (ids) => {
        const foundTasks = [];
        for (const column in tasks) for (const task of tasks[column]) if (ids.includes(task.id)) foundTasks.push(task);
        return foundTasks;
    };
    const handleDragStart = (e) => {
        if (isSelecting) { e.preventDefault(); return; }
        if (e.active.data.current?.type === 'Task' && !selectedTaskIds.includes(e.active.id)) dispatch(clearTaskSelection());
        setActiveItem(e.active);
    };
    const handleDragEnd = ({ active, over }) => {
        setActiveItem(null);
        if (!over) return;
        if (active.id === 'new-task-creator') {
            if (over.id === 'delete-area') return;
            const destColId = over.data.current?.type === 'Column' ? over.id : findColumnForTask(over.id);
            if (destColId) { setDestinationColumn(destColId); setCreateModalOpen(true); }
            return;
        }
        if (active.data.current?.type !== 'Task') return;
        if (over.id === 'delete-area') {
            if (selectedTaskIds.length > 1 && selectedTaskIds.includes(active.id)) dispatch(deleteSelectedTasks());
            else { const col = findColumnForTask(active.id); if (col) dispatch(deleteTask({ columnId: col, taskId: active.id })); }
            return;
        }
        const destColumn = over.data.current?.type === 'Column' ? over.id : findColumnForTask(over.id);
        if (!destColumn) return;
        if (selectedTaskIds.includes(active.id) && selectedTaskIds.length > 1) dispatch(moveSelectedTasks({ destColumn }));
        else {
            const sourceColumn = findColumnForTask(active.id);
            if (!sourceColumn) return;
            const sourceIndex = tasks[sourceColumn].findIndex(t => t.id === active.id);
            const destIndex = over.data.current?.type === 'Task' ? tasks[destColumn].findIndex(t => t.id === over.id) : tasks[destColumn].length;
            if (sourceColumn !== destColumn || sourceIndex !== destIndex) dispatch(moveTask({ sourceColumn, destColumn, sourceIndex, destIndex }));
        }
    };
    const handleSaveNewTask = ({ title, assignee }) => {
        if (destinationColumn) { dispatch(addTask({ columnId: destinationColumn, title, assignee })); setCreateModalOpen(false); }
        setDestinationColumn(null);
    };
    const handleOpenTaskDetails = (taskId) => {
        const task = getTaskById(taskId);
        if (task) { setActiveTask(task); setDetailModalOpen(true); }
    };
    const handleUpdateTask = (taskId, newTitle, newAssignee) => dispatch(updateTask({ taskId, newTitle, newAssignee }));
    const handleMouseDown = (e) => {
        const isBg = e.target.classList.contains('kanban-board') || e.target.classList.contains('column-tasks');
        if ((e.ctrlKey || e.metaKey) && isBg) {
            e.preventDefault(); e.stopPropagation(); setIsSelecting(true);
            initialMousePos.current = { x: e.clientX, y: e.clientY };
            setSelectionRect({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
        }
    };
    const handleMouseMove = (e) => {
        if (!isSelecting) return;
        e.preventDefault(); e.stopPropagation();
        const { clientX: curX, clientY: curY } = e;
        const { x: startX, y: startY } = initialMousePos.current;
        setSelectionRect({ x: Math.min(startX, curX), y: Math.min(startY, curY), width: Math.abs(curX - startX), height: Math.abs(curY - startY) });
    };
    const handleMouseUp = (e) => {
        if (isSelecting && selectionRect) {
            e.preventDefault(); e.stopPropagation();
            const ids = [];
            document.querySelectorAll('.task-card[data-task-id]').forEach(el => {
                if (areRectsColliding(selectionRect, el.getBoundingClientRect())) ids.push(el.getAttribute('data-task-id'));
            });
            if (ids.length > 0) dispatch(addTasksToSelection(ids));
            setIsSelecting(false); setSelectionRect(null);
        } else {
            const isBg = e.target.classList.contains('kanban-board') || e.target.classList.contains('column-tasks');
            if (isBg && !e.ctrlKey && !e.metaKey) dispatch(clearTaskSelection());
        }
    };
    const isMultiDragging = activeItem?.data.current?.type === 'Task' && selectedTaskIds.length > 1 && selectedTaskIds.includes(activeItem.id);
    const columnTitles = { 'bekliyor': 'Bekliyor/Planlandı', 'yapiliyor': 'Yapılıyor', 'test': 'Test Ediliyor', 'geribildirim': 'Geri Bildirim Bekleniyor', 'tamamlandi': 'Tamamlandı' };
    const activeTaskColumnName = activeTask ? findColumnForTask(activeTask.id) : '';

    return (
        <div className="app-container">
            <div className="dnd-context-wrapper">
                <DndContext {...{ sensors, onDragStart: handleDragStart, onDragEnd: handleDragEnd, collisionDetection: closestCenter }}>
                    <Header projectTitle="Proje Yönetim Panosu" />
                    <KanbanBoard {...{ tasks, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onOpenTaskDetails: handleOpenTaskDetails, assigneeStyles }} />
                    <DragOverlay dropAnimation={null}>
                        {activeItem?.id === 'new-task-creator' && <NewNoteDragVisual />}
                        {activeItem?.data.current?.type === 'Task' && !isMultiDragging && <Task task={activeItem.data.current.task} isSelected={false} onTaskClick={() => {}} onOpenDetails={() => {}} assigneeStyles={assigneeStyles} />}
                        {isMultiDragging && (
                            <div className="multi-drag-overlay">
                                <div className="task-count-badge">{selectedTaskIds.length}</div>
                                {getTasksByIds(selectedTaskIds).slice(0, 3).map((task, index) => (
                                    <div key={task.id} className="task-card-drag-preview" style={{ zIndex: -index, transform: `rotate(${index * 4}deg)` }}>
                                        <div className="task-card-header"></div>{task.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>
            </div>
            {selectionRect && <div className="selection-rectangle" style={{ left: selectionRect.x, top: selectionRect.y, width: selectionRect.width, height: selectionRect.height }} />}
            <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onSave={handleSaveNewTask} />
            <TaskDetailModal isOpen={isDetailModalOpen} onClose={() => setDetailModalOpen(false)} task={activeTask} columnName={columnTitles[activeTaskColumnName]} onSave={handleUpdateTask} />
        </div>
    );
}

export default App;