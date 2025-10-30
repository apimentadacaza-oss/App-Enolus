import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import type { Rite, Circle } from '../types';

interface RiteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  rite: Rite;
  circle: Circle;
}

const RiteSuccessModal: React.FC<RiteSuccessModalProps> = ({ isOpen, onClose, rite, circle }) => {
  const { t } = useTranslation('confraria');
  const modalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);
  
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll('button');
        if (focusableElements.length === 1) event.preventDefault();
      }
    };
    titleRef.current?.focus();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <>
      <div className="rite-success-backdrop" onClick={onClose} role="presentation" />
      <div className="rite-success-layer" role="dialog" aria-modal="true" aria-labelledby="riteSuccessTitle" aria-describedby="riteSuccessDesc">
        <div ref={modalRef} className="rite-success-card">
          <div className="header">
            <span className="icon">{rite.icon}</span>
            <h2 id="riteSuccessTitle" ref={titleRef} tabIndex={-1} className="title outline-none">
              {t('rite_success_modal.title')}
            </h2>
          </div>
          <p id="riteSuccessDesc" className="subtitle">
            {t('rite_success_modal.subtitle', { xp: rite.xp })}
          </p>
          <div className="body-text">
            <p>{t('rite_success_modal.body')}</p>
          </div>
          <button onClick={onClose} className="action-button">
            {t('rite_success_modal.cta')}
          </button>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default RiteSuccessModal;