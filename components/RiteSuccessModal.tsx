import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
// FIX: The `Rite` and `Circle` types are defined in `types.ts`, not exported from the Profile page component.
import type { Rite, Circle } from '../types';

interface RiteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  rite: Rite;
  circle: Circle;
}

const RiteSuccessModal: React.FC<RiteSuccessModalProps> = ({ isOpen, onClose, rite, circle }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Handle accessibility (Esc key, focus trapping)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      
      // Focus trapping
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll('button');
        if (focusableElements && focusableElements.length === 1) {
            // If there's only one button, prevent tabbing away
            event.preventDefault();
        }
      }
    };

    // Set initial focus
    titleRef.current?.focus();

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <>
      <div className="rite-success-backdrop" onClick={onClose} role="presentation" />
      <div 
        className="rite-success-layer" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="riteSuccessTitle" 
        aria-describedby="riteSuccessDesc"
      >
        <div ref={modalRef} className="rite-success-card">
          <div className="header">
            <span className="icon">{rite.icon}</span>
            <h2 id="riteSuccessTitle" ref={titleRef} tabIndex={-1} className="title outline-none">
              Rito Concluído
            </h2>
          </div>
          <p id="riteSuccessDesc" className="subtitle">
            +{rite.xp} Sabedoria Acumulada
          </p>
          <div className="body-text">
            <p>
              Seu cálice se enche de sabedoria. O tempo agora habita em sua taça.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="action-button"
          >
            Brindar e Voltar à Confraria
          </button>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default RiteSuccessModal;
