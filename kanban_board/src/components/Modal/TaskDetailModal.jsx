import React, { useState, useEffect } from 'react';
import AssigneeInputManager from './AssigneeInputManager'; // YENİ
import './TaskDetailModal.css';

const TaskDetailModal = ({ isOpen, onClose, task, columnName, onSave }) => {
  // State'leri ayırdık
  const [title, setTitle] = useState('');
  const [assignees, setAssignees] = useState(['']);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      // Eğer görevde atanmış kimse yoksa, boş bir input göster
      setAssignees(task.assignee && task.assignee.length > 0 ? task.assignee : ['']);
    } else {
      setShowHistory(false);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    if (title.trim()) {
      // Boş inputları filtreleyerek temizlenmiş diziyi gönder
      const finalAssignees = assignees.filter(a => a.trim() !== '');
      onSave(task.id, title, finalAssignees);
      onClose();
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content detail-modal-content" onClick={(e) => e.stopPropagation()}>

        <div className="detail-header">
          <span className="detail-date">Son Güncelleme: {formatDate(task.updatedAt)}</span>
          <span className="detail-column">Kolon: <strong>{columnName}</strong></span>
        </div>

        <div className="detail-body">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="detail-textarea"
            placeholder="Görev Açıklaması"
          />
          {/* YENİ: Dinamik Atanan Kişi Yöneticisi */}
          <AssigneeInputManager
            assignees={assignees}
            onAssigneesChange={setAssignees}
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
                    <p><span>Atanan:</span> "{entry.oldAssignee?.join(', ')}"</p>
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