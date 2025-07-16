import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsUncompleted } from './redux/taskSlice';

export default function Completed() {
  const dispatch = useDispatch();
  const completedTasks = useSelector(state =>
    state.task.tasks.filter(task => task.completed)
  );

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
              style={{
                backgroundColor: '#e1f5e5',
                borderLeft: '4px solid green',
                paddingBottom: '10px',
              }}
            >
              <div style={{ fontWeight: 'bold', textDecoration: 'line-through', color: '#526d60' }}>
                {task.title}
              </div>
              <div style={{ fontStyle: 'italic', fontSize: '14px', color: '#6e7f73' }}>
                {task.content}
              </div>
              <button
                onClick={() => dispatch(markAsUncompleted(task.id))}
                style={{
                  marginTop: '8px',
                  padding: '6px 10px',
                  backgroundColor: '#95a5a6',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Geri Al
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="TaskMainRight">
        {completedTasks.length > 0 ? (
          <div className="taskDetail">
            <p style={{ fontStyle: 'italic', color: '#5d6d7e' }}>
              Tamamlanmış görevler arşivlendi. Dilerseniz geri alabilirsiniz.
            </p>
          </div>
        ) : (
          <p style={{ padding: '20px' }}>Tamamlanan görev yok.</p>
        )}
      </div>
    </div>
  );
}
