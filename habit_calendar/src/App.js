import React from 'react';
import Calendar from './components/Calendar'; // Yeni takvim bileşenimiz
import './App.css'; // Genel App stilleri

function App() {
  return (
    <div className="App">
      {/* İsterseniz bir başlık ekleyebilirsiniz */}
      {/* <h1>Alışkanlık Takvimi</h1> */}
      <main>
        <Calendar />
      </main>
    </div>
  );
}

export default App;