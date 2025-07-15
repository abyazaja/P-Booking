import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  showHeader = true,
  className = '',
  actions
}) {
  // Size variations
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`
            relative w-full ${sizeClasses[size]} 
            bg-white rounded-3xl shadow-2xl 
            transform transition-all duration-300 
            animate-in zoom-in-95 slide-in-from-bottom-4
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {showHeader && (
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-ballblack">
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Convenience components
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  confirmVariant = "danger"
}) {
  const variantClasses = {
    danger: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-ballgreen hover:bg-ballgreen/90 text-white",
    primary: "bg-blue-500 hover:bg-blue-600 text-white"
  };

  const actions = (
    <>
      <button
        onClick={onClose}
        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 hover:scale-105 ${variantClasses[confirmVariant]}`}
      >
        {confirmText}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      actions={actions}
    >
      <p className="text-gray-700 leading-relaxed">
        {message}
      </p>
    </Modal>
  );
}

export function LoadingModal({
  isOpen,
  title = "Memproses...",
  message = "Mohon tunggu sebentar..."
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Cannot close loading modal
      title={title}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={false}
    >
      <div className="text-center py-4">
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto border-4 border-ballgray rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ballgreen to-emerald-600 shadow-lg animate-pulse">
              <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
                <div className="w-3/4 h-3/4 rounded-full border-2 border-white/40"></div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-ballgreen border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        
        <p className="text-gray-700">{message}</p>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-ballgreen rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </Modal>
  );
}