import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { InventoryProvider } from './context/InventoryContext';
import { ToastProvider } from './components/ui/Toast';
import './i18n/index'; // Load translations
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <InventoryProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </InventoryProvider>
    </ThemeProvider>
  </StrictMode>
);
