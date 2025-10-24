import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Find the root element defined in public/index.html
const container = document.getElementById('root');
const root = createRoot(container);

// Render the main application component
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
