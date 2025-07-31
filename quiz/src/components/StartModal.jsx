import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { startQuiz } from '../redux/quizSlice'; 
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
        onClose(); 
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Teste Başla</h2>
                <p>Başlamadan önce lütfen adınızı girin. Soyadınız isteğe bağlıdır.</p>
                <input
                    type="text"
                    placeholder="İsim (Zorunlu)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoFocus 
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