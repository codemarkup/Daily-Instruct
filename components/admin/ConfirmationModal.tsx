'use client';

import React, { useEffect } from 'react';
import '../../styles/admin/components.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor?: 'gold' | 'danger' | 'success' | 'red';
  icon?: string;
  showCancel?: boolean;
  loading?: boolean; // ADD THIS
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmColor = 'gold',
  icon = '⚠️',
  showCancel = true,
  loading = false, // ADD THIS
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    // Don't close automatically - let parent handle it after loading
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container animate-slide-in">
        <div className="modal-header">
          <div className="modal-icon">{icon}</div>
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="modal-close" aria-label="Close" disabled={loading}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-message">{message}</p>
          {loading && (
            <div className="modal-loading">
              <div className="loading-spinner"></div>
              <span className="loading-text">Processing...</span>
            </div>
          )}
        </div>
        <div className="modal-footer">
          {showCancel && (
            <button onClick={onClose} className="modal-button cancel" disabled={loading}>
              Cancel
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`modal-button confirm ${confirmColor}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;