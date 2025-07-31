import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// YOLU GÜNCELLE: ../redux/quizSlice
import { startQuiz } from '../redux/quizSlice'; 
// EKSİK OLAN SATIR BU: Modal'ın kendi stillerini import et
import './ModalStyle.css'; 

const StartModal = ({ isOpen, onClose }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const dispatch = useDispatch();

    const handleStart = () => {
        if (!firstName.trim()) {
            alert('Lütfen isminizi giriniz.');
            return;
        }
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
        dispatch(startQuiz(fullName));
        onClose(); // Modalı kapat
    };

    // Bu mantık sayesinde modal sadece 'isOpen' true ise render edilir.
    if (!isOpen) {
        return null;
    }

    return (
        // onClick={onClose} sayesinde modalın dışına tıklayınca kapanır
        <div className="modal-overlay" onClick={onClose}>
            {/* e.stopPropagation() sayesinde modalın içine tıklayınca kapanmaz */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Teste Başla</h2>
                <p>Başlamadan önce lütfen adınızı girin. Soyadınız isteğe bağlıdır.</p>
                <input
                    type="text"
                    placeholder="İsim (Zorunlu)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoFocus // Modal açılınca direkt bu alana odaklansın
                />
                <input
                    type="text"
                    placeholder="Soyisim (İsteğe Bağlı)"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <button className="modal-button" onClick={handleStart} disabled={!firstName.trim()}>
                    Devam Et
                </button>
            </div>
        </div>
    );
};

export default StartModal;