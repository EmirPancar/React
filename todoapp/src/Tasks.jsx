import React, { useState } from 'react';
import './Tasks.css';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, deleteTask, updateTask, setSelectedTaskId } from './redux/taskSlice';

export default function Tasks() {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.task.tasks);
    const selectedTaskId = useSelector(state => state.task.selectedTaskId);
    const selectedTask = tasks.find(task => task.id === selectedTaskId);

    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ id: '', title: '', content: '', date: '' });
    const [editing, setEditing] = useState(false);

    const handleAddTask = () => {
        setShowModal(true);
        setNewTask({ id: crypto.randomUUID(), title: '', content: '', date: '' });
        setEditing(false);
    };

    const handleSaveTask = () => {
        if (editing) {
            dispatch(updateTask({ id: selectedTaskId, updatedTask: newTask }));
        } else {
            dispatch(addTask(newTask));
        }
        setShowModal(false);
    };

    const handleDeleteTask = () => {
        if (window.confirm('Silmek istediğinize emin misiniz?')) {
            dispatch(deleteTask(selectedTaskId));
        }
    };

    const handleEditTask = () => {
        setNewTask(selectedTask);
        setEditing(true);
        setShowModal(true);
    };

    return (
        <div className="TaskMain">
            <div className="TaskMainLeft">
                <button className="addTaskButton" onClick={handleAddTask}>+ Görev Oluştur</button>
                <div className="taskList">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="taskItem"
                            onClick={() => dispatch(setSelectedTaskId(task.id))}>
                            {task.title}
                        </div>
                    ))}
                </div>
            </div>

            <div className="TaskMainRight">
                {selectedTask ? (
                    <div className="taskDetail">
                        <div className="taskHeader enhanced">
                            <span className="taskTitle">{selectedTask.title}</span>
                            <span className="taskDate">{new Intl.DateTimeFormat('tr-TR').format(new Date(selectedTask.date))} 📅</span>
                        </div>
                        <div className="taskContent padded">{selectedTask.content}</div>
                        <div className="taskActions styled">
                            <button className="editBtn" onClick={handleEditTask}>Düzenle </button>
                            <button className="deleteBtn" onClick={handleDeleteTask}>Sil </button> {/*🗑️ ✏️*/}
                        </div>
                    </div>
                ) : (
                    <p style={{ padding: '20px' }}>Bir görev seçin...</p>
                )}
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modalContent">
                        <h3>Görev {editing ? 'Düzenle' : 'Oluştur'}</h3>
                        <input
                            type="text"
                            placeholder="Başlık"
                            value={newTask.title}
                            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                        />
                        <textarea
                            placeholder="İçerik"
                            value={newTask.content}
                            onChange={e => setNewTask({ ...newTask, content: e.target.value })}
                        />
                        <input
                            type="date"
                            value={newTask.date}
                            onChange={e => setNewTask({ ...newTask, date: e.target.value })}
                        />
                        <button onClick={handleSaveTask}>Kaydet</button>
                        <button onClick={() => setShowModal(false)}>İptal</button>
                    </div>
                </div>
            )}
        </div>
    );
}