import React, { useState } from 'react';
import MapChart from './components/MapChart';
import Sidebar from './components/Sidebar';
import { FaBars } from 'react-icons/fa'; // Menü ikonu
import './App.css'; // Yeni CSS dosyasını import et

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      {/* Sidebar'ı ve toggle butonunu render et */}
      <button onClick={toggleSidebar} className="sidebar-toggle-btn">
        <FaBars />
      </button>
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      
      {/* Harita component'i */}
      <MapChart />
    </div>
  );
}

export default App;