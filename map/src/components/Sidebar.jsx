import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setCenterAndZoom } from '../redux/mapSlice';
import { cities } from '../mockData';
import { FaTimes } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const filteredCities = useMemo(() => {
    if (!searchTerm) {
      return []; 
    }
    return cities.filter(city =>
      city.name.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'))
    );
  }, [searchTerm]);

  const handleCityClick = (city) => {
    dispatch(setCenterAndZoom({ ...city, zoom: 12 }));
    setSearchTerm(''); 
    toggle(); 
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={toggle} className="close-btn">
        <FaTimes />
      </button>
      <div className="sidebar-content">
        <h3>Şehir Ara</h3>
        <div className="search-container"> 
          <input
            type="text"
            placeholder="Örn: İstanbul"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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