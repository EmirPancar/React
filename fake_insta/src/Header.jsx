import React, { useState, useEffect, useRef } from 'react';
import './HeaderStyle.css'; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Menü referansı

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="Header">
      <div className="Header-content">
        
        <div className="Header-left">
          <div className="HeaderImage"></div>
        </div>

        
        <div className="Header-center">
          <div className="SearchBar">
            <input type="text" placeholder="Arama yap..." />
            <button type="submit" aria-label="Ara">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </div>
        </div>

        
        <div className="Header-right" ref={menuRef}>
          <nav className="Header-nav">
            <button className="nav-button">Sepet 🛒</button>
          </nav>
          <button
            className="Menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menüyü aç/kapat"
            aria-expanded={isMenuOpen}
          >
            <div className="menu-icon-line"></div>
            <div className="menu-icon-line"></div>
            <div className="menu-icon-line"></div>
          </button>
        </div>
      </div>

       
       <div className={`Sidebar ${isMenuOpen ? 'open' : ''}`} >
            <button
                className="close-button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Menüyü kapat"
            >×</button>
            <ul className="Sidebar-nav">
                <li><a href="#1">Seçenek 1</a></li>
                <li><a href="#2">Seçenek 2</a></li>
                <li><a href="#3">Seçenek 3</a></li>
            </ul>
        </div>
        
        {isMenuOpen && <div className="overlay" onClick={() => setIsMenuOpen(false)}></div>}
    </header>
  );
};

export default Header;