import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { Patent, Circle } from '../types';

interface PatentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patent: Patent;
  circle: Circle | null;
}

const PatentDetailModal: React.FC<PatentDetailModalProps> = ({ isOpen, onClose, patent, circle }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'Tab') {
        // Simple focus trap
        if (event.shiftKey) {
            if (document.activeElement === closeButtonRef.current) {
                closeButtonRef.current?.focus(); 
                event.preventDefault();
            }
        } else {
            if (document.activeElement === closeButtonRef.current) {
                closeButtonRef.current?.focus();
                event.preventDefault();
            }
        }
      }
    };
    
    closeButtonRef.current?.focus();

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
      <div className="patent-detail-backdrop" onClick={onClose} role="presentation" />
      <div 
        className="patent-detail-layer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="patentDetailTitle"
      >
        <div ref={modalRef} className="patent-detail-card">
          <button ref={closeButtonRef} onClick={onClose} className="close-button" aria-label="Fechar modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <header className="header">
            <p className="icon">{patent.icon}</p>
            <h2 id="patentDetailTitle" className="title">{patent.name}</h2>
            <p className="subtitle">"{patent.ceremonialPhrase}"</p>
          </header>
          <div className="content">
            {circle && circle.rites.length > 0 ? (
              <>
                <h3 className="section-title">Ritos Dominados</h3>
                <ul className="rite-list">
                  {circle.rites.map(rite => (
                    <li key={rite.title} className="rite-item">
                      <span className="icon">{rite.icon}</span>
                      <div className="text">
                        <p className="title">{rite.title}</p>
                        <p className="description">{rite.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-center text-soft-graphite/80">Os ritos que levaram a esta conquista serão revelados em breve.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default PatentDetailModal;
