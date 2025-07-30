import React, { useState, useEffect } from 'react';
import './TaskDetailModal.css'; // Bu CSS dosyasını bir sonraki adımda güncelleyeceğiz

const TaskDetailModal = ({ isOpen, onClose, task, columnName, onSave }) => {
  const [editableTask, setEditableTask] = useState({ title: '', assignee: '' });
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (task) {
      setEditableTask({ title: task.title, assignee: task.assignee || '' });
    } else {
        // Modal kapandığında veya görev olmadığında geçmişi de kapat
        setShowHistory(false);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Sadece başlık doluysa kaydet
    if (editableTask.title.trim()) {
        onSave(task.id, editableTask.title, editableTask.assignee);
        onClose(); // Kaydettikten sonra modal'ı kapat
    } else {
        alert("Görev başlığı boş bırakılamaz.");
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih bilgisi yok';
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    // Tıklayınca kapanması için overlay ve tıklamanın içeri yayılmasını önlemek için content yapısı
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content detail-modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="detail-header">
          <span className="detail-date">Son Güncelleme: {formatDate(task.updatedAt)}</span>
          <span className="detail-column">Kolon: <strong>{columnName}</strong></span>
        </div>

        <div className="detail-body">
          <textarea
            name="title"
            value={editableTask.title}
            onChange={handleChange}
            className="detail-textarea"
            placeholder="Görev Açıklaması"
          />
          <input
            type="text"
            name="assignee"
            value={editableTask.assignee}
            onChange={handleChange}
            className="detail-input"
            placeholder="Atanan Kişi"
          />
        </div>

        <div className="detail-footer">
          <button className="btn-history" onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? 'Geçmişi Gizle' : 'Değişiklik Geçmişi'}
          </button>
          <div className="footer-actions">
            <button onClick={onClose} className="btn-cancel">İptal</button>
            <button onClick={handleSave} className="btn-save">Kaydet</button>
          </div>
        </div>

        {showHistory && (
          <div className="history-section">
            <h4>Geçmiş Değişiklikler</h4>
            {task.history && task.history.length > 0 ? (
              <ul>
                {task.history.map((entry, index) => (
                  <li key={index}>
                    <strong>{formatDate(entry.timestamp)}</strong>
                    <p><span>Başlık:</span> "{entry.oldTitle}"</p>
                    <p><span>Atanan:</span> "{entry.oldAssignee}"</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-history">Bu görev için geçmiş değişiklik bulunmuyor.</p>
            )}
             <p className="history-creation-note">İlk Oluşturulma: {formatDate(task.createdAt)}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default TaskDetailModal;