// Safely allow window.fetch assignment in strict environments
try {
  let currentFetch = window.fetch ? window.fetch.bind(window) : undefined;
  Object.defineProperty(window, 'fetch', {
    get() {
      return currentFetch;
    },
    set(newFetch) {
      currentFetch = newFetch;
    },
    configurable: true,
    enumerable: true,
  });
} catch {
  // Ignore if property is non-configurable
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AppProvider } from './context/AppContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);


