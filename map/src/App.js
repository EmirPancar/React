import React, { useState } from 'react';
import MapChart from './components/MapChart';
import Sidebar from './components/Sidebar';
import { FaBars } from 'react-icons/fa'; 
import './App.css'; 

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      <button onClick={toggleSidebar} className="sidebar-toggle-btn">
        <FaBars />
      </button>
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      
      <MapChart />
    </div>
  );
}

export default App;