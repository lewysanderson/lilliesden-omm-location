import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Inject Tailwind CSS
const script = document.createElement('script');
script.src = '[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)';
document.head.appendChild(script);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

