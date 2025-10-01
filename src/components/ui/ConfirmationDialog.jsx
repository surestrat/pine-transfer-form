import '@styles/ConfirmationDialog.css';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import {
  AlertTriangle,
  X,
} from 'lucide-react';

import { Button } from './Button';

const ConfirmationDialog = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Continue", 
    cancelText = "Cancel",
    variant = "warning" 
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            <div 
                className="dialog-overlay" 
                onClick={handleBackdropClick}
                onKeyDown={handleKeyDown}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
            >
                <motion.div
                    className={`dialog-container ${variant}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="dialog-header">
                        <div className="dialog-icon">
                            <AlertTriangle size={24} />
                        </div>
                        <button 
                            type="button"
                            className="dialog-close"
                            onClick={onClose}
                            aria-label="Close dialog"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="dialog-content">
                        <h3 className="dialog-title">{title}</h3>
                        <p className="dialog-message">{message}</p>
                    </div>
                    
                    <div className="dialog-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="dialog-cancel"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={onConfirm}
                            className="dialog-confirm"
                        >
                            {confirmText}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmationDialog;
