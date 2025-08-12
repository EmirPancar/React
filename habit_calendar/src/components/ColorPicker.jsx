import React from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { setDayColor } from '../redux/habitsSlice';
import './ColorPicker.css';

const PRESET_COLORS = [
    '#ff6961', '#ffb347', '#fdfd96', '#77dd77', '#a2d2ff',
    '#b79ced', '#fdcae1', '#bde0fe', '#ffc09f', '#cbf3f0',
    '#e1b382', '#9a7f71', '#d4a5a5', '#a8d8ea', '#f3d5b5',
];

const ColorPicker = ({ date, onClose }) => {
    const dispatch = useDispatch();
    const dateStr = format(date, 'yyyy-MM-dd');

    const handleColorSelect = (selectedColor) => {
        dispatch(setDayColor({ date: dateStr, color: selectedColor }));
        onClose();
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content color-picker-modal" onClick={e => e.stopPropagation()}>
                <h4>Bir Renk Seçin</h4>
                <div className="color-grid">
                    {PRESET_COLORS.map(presetColor => (
                        <div
                            key={presetColor}
                            className="color-swatch"
                            style={{ backgroundColor: presetColor }}
                            onClick={() => handleColorSelect(presetColor)}
                        />
                    ))}
                     <div
                        className="color-swatch clear-color"
                        onClick={() => handleColorSelect(null)}
                        title="Rengi Temizle"
                    >
                        &times;
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;