import React, { useState, useMemo, useRef, useEffect } from 'react'; 
import { useDispatch } from 'react-redux';
import { setCenterAndZoom } from '../redux/mapSlice';
import { cities } from '../mockData';
import { FaTimes } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  
  const inputRef = useRef(null);

  const filteredCities = useMemo(() => {
    if (!searchTerm) {
      return []; 
    }
    return cities.filter(city =>
      city.name.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'))
    );
  }, [searchTerm]);

  const handleCityClick = (city) => {
    if (city && city.coordinates) {
      dispatch(setCenterAndZoom({ ...city, zoom: 12 }));
      setSearchTerm(''); 
      toggle(); 
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (filteredCities.length > 0) {
        event.preventDefault(); 
        const topCity = filteredCities[0];
        handleCityClick(topCity);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus(); 
      }, 100); 

      return () => clearTimeout(timer);
    }
  }, [isOpen]); 

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={toggle} className="close-btn">
        <FaTimes />
      </button>
      <div className="sidebar-content">
        <h3>Şehir Ara</h3>
        <div className="search-container"> 
          <input
            ref={inputRef} 
            type="text"
            placeholder="Örn: İstanbul"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && filteredCities.length > 0 && (
            <ul className="suggestions-list">
              {filteredCities.map(city => (
                <li key={city.name} onClick={() => handleCityClick(city)}>
                  {city.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;