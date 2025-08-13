import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. LEAFLET CSS'İNİ BURADA, DİĞER HER ŞEYDEN ÖNCE IMPORT EDİN
import 'leaflet/dist/leaflet.css';

// 2. KENDİ CSS DOSYANIZI DAHA SONRA IMPORT EDİN
import './App.css';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);