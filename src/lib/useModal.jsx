import React, { useState, useCallback, useRef } from 'react';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const Modal = ({ children }) => {
    const modalRef = useRef();

    const handleClickOutside = useCallback((e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    }, []);

    if (!isOpen) return null;

    return (
      <div style={styles.overlay} onClick={handleClickOutside}>
        <div ref={modalRef} style={styles.modal}>
          <button style={styles.closeButton} onClick={closeModal}>x</button>
          {children}
        </div>
      </div>
    );
  };

  return { Modal, openModal, closeModal };
};

// Styles for the modal and related components
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    width: '480px',
    maxWidth: '90vw',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: '0.625rem',
    right: '0.625rem',
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default useModal;