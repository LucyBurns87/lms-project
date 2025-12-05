/**
 * Reusable Confirmation Modal
 * Used for delete confirmations, logout, etc.
 */
import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' // 'danger', 'warning', 'info'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-header ${type}`}>
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onCancel} className="btn-secondary">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`btn-${type}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;