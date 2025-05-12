import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="modal"
      unmountOnExit
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div 
          className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto transform" 
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </CSSTransition>
  );
};

export default Modal;
