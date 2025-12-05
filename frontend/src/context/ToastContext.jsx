/**
 * Toast Context
 * Provides toast notification functionality throughout the app
 * Usage: const { showToast } = useToast();
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer from '../components/common/ToastContainer';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Add a new toast notification
   * @param {string} message - Message to display
   * @param {string} type - 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duration in milliseconds (default 3000)
   */
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  /**
   * Remove a toast by ID
   */
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Convenience methods
   */
  const showSuccess = useCallback((message, duration) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message, duration) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const showWarning = useCallback((message, duration) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const showInfo = useCallback((message, duration) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};