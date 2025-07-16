import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTaskId, markAsUncompleted } from './redux/taskSlice';
import './Tasks.css'; // Mevcut stilleri kullanmak için

export default function Completed() {
  const dispatch = useDispatch();
  const completedTasks = useSelector(state =>
    state.task.tasks.filter(task => task.completed)
  );
  const selectedTaskId = useSelector(state => state.task.selectedTaskId);
  const selectedTask = completedTasks.find(task => task.id === selectedTaskId);

  return (
    <div className="TaskMain">
      <div className="TaskMainLeft">
        <h2 style={{ marginBottom: '15px', color: '#2c3e50' }}>✔ Tamamlanan Görevler</h2>
        <div className="taskList">
          {completedTasks.length === 0 && <p>Henüz tamamlanmış görev yok.</p>}
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="taskItem"
              onClick={() => dispatch(setSelectedTaskId(task.id))}
              style={{
                backgroundColor: selectedTaskId === task.id ? '#d0ecd8' : '#e1f5e5',
                borderLeft: '4px solid green',
                textDecoration: 'line-through',
                color: '#526d60',
              }}
            >
              {task.title}
            </div>
          ))}
        </div>
      </div>

      <div className="TaskMainRight">
        {selectedTask ? (
          <div className="taskDetail">
            <div className="taskHeader enhanced">
              <span className="taskTitle">{selectedTask.title} ✔</span>
              <span className="taskDate">
                {new Intl.DateTimeFormat('tr-TR').format(new Date(selectedTask.date))} 📅
              </span>
            </div>
            <div className="taskContent padded">{selectedTask.content}</div>
            <div className="taskActions styled">
              <button
                className="editBtn"
                onClick={() => dispatch(markAsUncompleted(selectedTask.id))}
              >
                Geri Al
              </button>
            </div>
          </div>
        ) : (
          <p style={{ padding: '20px' }}>Bir görev seçin...</p>
        )}
      </div>
    </div>
  );
}
