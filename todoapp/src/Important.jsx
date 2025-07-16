import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTaskId, markAsUncompleted } from './redux/taskSlice';

export default function Important() {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.task.tasks.filter(task => task.important));
  const selectedTaskId = useSelector(state => state.task.selectedTaskId);
  const selectedTask = tasks.find(task => task.id === selectedTaskId);

  return (
    <div className="TaskMain">
      <div className="TaskMainLeft">
        <h2 style={{ marginBottom: '15px' }}>⭐ Önemli Görevler</h2>
        <div className="taskList">
          {tasks.length === 0 && <p>Hiç önemli görev yok.</p>}
          {tasks.map((task) => (
            <div
              key={task.id}
              className="taskItem"
              onClick={() => dispatch(setSelectedTaskId(task.id))}
              style={{ borderLeft: '4px solid gold', backgroundColor: '#fff9e6'}}
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
              <span className="taskTitle">{selectedTask.title} ⭐</span>
              <span className="taskDate">
                {new Intl.DateTimeFormat('tr-TR').format(new Date(selectedTask.date))} 📅
              </span>
            </div>
            <div className="taskContent padded">{selectedTask.content}</div>
          </div>
        ) : (
          <p style={{ padding: '20px' }}>Bir görev seçin...</p>
        )}
      </div>
    </div>
  );
}
