import React, { useEffect, useRef } from "react";
import "./Modal.css"; // Import CSS for animations

export default function Modal({ isOpen, onClose, children }) {
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={onClose}
        />
        <div
          ref={modalContentRef}
          className={`relative z-50 modal-content transition-transform duration-300 ${
            isOpen ? "scale-100" : "scale-95"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
