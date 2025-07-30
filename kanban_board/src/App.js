import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import {
    addTask,
    deleteTask,
    moveTask,
    updateTask, // Yeni eklenen action
    moveSelectedTasks,
    deleteSelectedTasks,
    clearTaskSelection,
    addTasksToSelection
} from './redux/tasksSlice';

import Header from './components/Header/Header';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import Task from './components/KanbanBoard/Task';
import Modal from './components/Modal/Modal';
import TaskDetailModal from './components/Modal/TaskDetailModal';
import './App.css';

// Dikdörtgen çarpışma kontrolü fonksiyonu
const areRectsColliding = (rect1, rect2) => {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
};

// Sürüklenen yeni not için görsel bileşen
const NewNoteDragVisual = () => <div className="task-card new-note-visual">Yeni Not...</div>;

function App() {
    const { tasks, selectedTaskIds } = useSelector(state => state);
    const dispatch = useDispatch();

    const [activeItem, setActiveItem] = useState(null);
    
    // Yeni görev oluşturma modal'ı için state'ler
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [destinationColumn, setDestinationColumn] = useState(null);

    // Görev detayı/düzenleme modal'ı için state'ler
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [activeTask, setActiveTask] = useState(null);
    
    // Alan seçimi (selection rectangle) için state'ler
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionRect, setSelectionRect] = useState(null);
    const initialMousePos = useRef({ x: 0, y: 0 });

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8, // Sürüklemeyi başlatmak için 8px hareket gerekliliği
        },
    }));

    // Yardımcı fonksiyonlar
    const findColumnForTask = (taskId) => {
        for (const columnId in tasks) {
            if (tasks[columnId].some(task => task.id === taskId)) {
                return columnId;
            }
        }
        return null;
    };
    
    const getTaskById = (taskId) => {
      for (const column in tasks) {
        const task = tasks[column].find(t => t.id === taskId);
        if (task) return task;
      }
      return null;
    }

    const getTasksByIds = (ids) => {
        const foundTasks = [];
        for (const column in tasks) {
            for (const task of tasks[column]) {
                if (ids.includes(task.id)) {
                    foundTasks.push(task);
                }
            }
        }
        return foundTasks;
    };

    // Dnd-kit olay yöneticileri
    const handleDragStart = (event) => {
        if (isSelecting) { // Eğer alan seçimi aktifse sürüklemeyi başlatma
            event.preventDefault();
            return;
        }
        const { active } = event;
        const activeId = active.id;
        const activeIsTask = active.data.current?.type === 'Task';
        if (activeIsTask && !selectedTaskIds.includes(activeId)) {
            dispatch(clearTaskSelection());
        }
        setActiveItem(event.active);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveItem(null);
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;
        const activeIsNewNote = activeId === 'new-task-creator';

        if (activeIsNewNote) {
            if (over.id === 'delete-area') return; // Yeni not silme alanına sürüklenirse işlem yapma
            let destColId = over.data.current?.type === 'Column' ? overId : findColumnForTask(overId);
            if (destColId) {
                setDestinationColumn(destColId);
                setCreateModalOpen(true);
            }
            return;
        }

        const activeIsTask = active.data.current?.type === 'Task';
        if (!activeIsTask) return;

        if (over.id === 'delete-area') {
            if (selectedTaskIds.length > 1 && selectedTaskIds.includes(activeId)) {
                dispatch(deleteSelectedTasks());
            } else {
                const sourceColumn = findColumnForTask(activeId);
                if (sourceColumn) {
                    dispatch(deleteTask({ columnId: sourceColumn, taskId: activeId }));
                }
            }
            return;
        }

        const destColumn = over.data.current?.type === 'Column' ? overId : findColumnForTask(overId);
        if (!destColumn) return;

        const isMovingSelection = selectedTaskIds.includes(activeId) && selectedTaskIds.length > 1;
        if (isMovingSelection) {
            dispatch(moveSelectedTasks({ destColumn }));
        } else {
            const sourceColumn = findColumnForTask(activeId);
            if (!sourceColumn) return;
            const sourceIndex = tasks[sourceColumn].findIndex(t => t.id === activeId);
            const destIndex = over.data.current?.type === 'Task' 
                ? tasks[destColumn].findIndex(t => t.id === overId) 
                : tasks[destColumn].length;
            if (sourceColumn !== destColumn || sourceIndex !== destIndex) {
                dispatch(moveTask({ sourceColumn, destColumn, sourceIndex, destIndex }));
            }
        }
    };

    // Modal olay yöneticileri
    const handleSaveNewTask = ({ title, assignee }) => {
        if (destinationColumn && title.trim()) {
            dispatch(addTask({ columnId: destinationColumn, title, assignee }));
            setCreateModalOpen(false);
        }
        setDestinationColumn(null);
    };

    const handleOpenTaskDetails = (taskId) => {
      const task = getTaskById(taskId);
      if (task) {
          setActiveTask(task);
          setDetailModalOpen(true);
      }
    };

    const handleUpdateTask = (taskId, newTitle, newAssignee) => {
        dispatch(updateTask({ taskId, newTitle, newAssignee }));
    };


    // Alan seçimi (selection rectangle) olay yöneticileri
    const handleMouseDown = (e) => {
        const target = e.target;
        const isBackgroundClick = target.classList.contains('kanban-board') || target.classList.contains('column-tasks');
        if ((e.ctrlKey || e.metaKey) && isBackgroundClick) {
            e.preventDefault();
            e.stopPropagation();
            setIsSelecting(true);
            initialMousePos.current = { x: e.clientX, y: e.clientY };
            setSelectionRect({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
        }
    };

    const handleMouseMove = (e) => {
        if (!isSelecting) return;
        e.preventDefault();
        e.stopPropagation();
        const currentX = e.clientX;
        const currentY = e.clientY;
        const startX = initialMousePos.current.x;
        const startY = initialMousePos.current.y;
        const x = Math.min(startX, currentX);
        const y = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        setSelectionRect({ x, y, width, height });
    };

    const handleMouseUp = (e) => {
        if (isSelecting && selectionRect) {
            e.preventDefault();
            e.stopPropagation();
            const selectedIds = [];
            const taskElements = document.querySelectorAll('.task-card[data-task-id]');
            taskElements.forEach(taskEl => {
                const taskRect = taskEl.getBoundingClientRect();
                const taskId = taskEl.getAttribute('data-task-id');
                if (areRectsColliding(selectionRect, taskRect)) {
                    selectedIds.push(taskId);
                }
            });
            if (selectedIds.length > 0) {
                dispatch(addTasksToSelection(selectedIds));
            }
            setIsSelecting(false);
            setSelectionRect(null);
        } else {
            const target = e.target;
            const isBackgroundClick = target.classList.contains('kanban-board') || target.classList.contains('column-tasks');
            if (isBackgroundClick && !e.ctrlKey && !e.metaKey) {
                dispatch(clearTaskSelection());
            }
        }
    };
    
    // Render için hesaplamalar
    const isMultiDragging = activeItem?.data.current?.type === 'Task' && selectedTaskIds.length > 1 && selectedTaskIds.includes(activeItem.id);
    const columnTitles = { 'bekliyor': 'Bekliyor/Planlandı', 'yapiliyor': 'Yapılıyor', 'test': 'Test Ediliyor', 'geribildirim': 'Geri Bildirim Bekleniyor', 'tamamlandi': 'Tamamlandı' };
    const activeTaskColumnName = activeTask ? findColumnForTask(activeTask.id) : '';

    return (
        <div className="app-container">
            <div className="dnd-context-wrapper">
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCenter}
                >
                    <Header projectTitle="Proje Yönetim Panosu" />
                    <KanbanBoard
                        tasks={tasks}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onOpenTaskDetails={handleOpenTaskDetails}
                    />
                    <DragOverlay dropAnimation={null}>
                        {activeItem?.id === 'new-task-creator' && <NewNoteDragVisual />}
                        {activeItem?.data.current?.type === 'Task' && !isMultiDragging && (
                            <Task task={activeItem.data.current.task} isSelected={false} onTaskClick={() => {}} onOpenDetails={() => {}} />
                        )}
                        {isMultiDragging && (
                            <div className="multi-drag-overlay">
                                <div className="task-count-badge">{selectedTaskIds.length}</div>
                                {getTasksByIds(selectedTaskIds).slice(0, 3).map((task, index) => (
                                    <div key={task.id} className="task-card-drag-preview" style={{ zIndex: -index, transform: `rotate(${index * 4}deg)` }}>
                                        <div className="task-card-header"></div>
                                        {task.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>
            </div>

            {selectionRect && (
                <div
                    className="selection-rectangle"
                    style={{ left: selectionRect.x, top: selectionRect.y, width: selectionRect.width, height: selectionRect.height }}
                />
            )}

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSave={handleSaveNewTask}
            />

            <TaskDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                task={activeTask}
                columnName={columnTitles[activeTaskColumnName]}
                onSave={handleUpdateTask}
            />
        </div>
    );
}

export default App;