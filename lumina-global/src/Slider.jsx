import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SliderStyle.css';


import slide1 from './images/PCSlide.png';
import slide2 from './images/KadınSlide.png';
import slide3 from './images/MücevherSlide.png';
import slide4 from './images/ErkekSlide.png';

const defaultSlides = [
  { id: 1, image: slide1 },
  { id: 2, image: slide2 },
  { id: 3, image: slide3 },
  { id: 4, image: slide4 }
];

const Slider = ({ slides = defaultSlides }) => {

  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const getSliderTrackStyle = () => {
    const offset = `calc(50% - (var(--slide-width) / 2) - (var(--slide-width) + var(--slide-gap)) * ${currentIndex})`;
    return {
      transform: `translateX(${offset})`
    };
  };

  return (
    <div className='SliderContainer'>
      <div className="slider-container">
        
        <button onClick={goToPrevious} className="slider-nav-button prev" aria-label={t('prevSlide')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div className="slider-viewport">
          <div className="slider-track" style={getSliderTrackStyle()}>
            {slides.map((slide, index) => (
              <div
                className={`slider-item ${index === currentIndex ? 'active' : ''}`}
                key={slide.id}
              >
                <img src={slide.image} alt={t(`slide_${slide.id}_title`)} className="slider-image" />
                <div className="slider-item-info">
                  <h3>{t(`slide_${slide.id}_title`)}</h3>
                  <p>{t(`slide_${slide.id}_description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
       
        <button onClick={goToNext} className="slider-nav-button next" aria-label={t('nextSlide')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  );
};

export default Slider;