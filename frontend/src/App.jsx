/**
 * Main App component with providers
 */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes';
import Navbar from './components/common/Navbar';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ToastProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <AppRoutes />
            </main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;