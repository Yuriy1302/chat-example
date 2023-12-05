import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  /* <React.StrictMode> */
    <App />
  /* </React.StrictMode> */
);


// Удаление StrictMode убирает двойной рендеринг (двойной вызов сокетов в useEffect)