import { useEffect } from 'react';
import * as SC from './Modal.styled';
import { createPortal } from 'react-dom';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ onClose, children }) {
  useEffect(() => {
    const onKeyDown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <SC.Overlay onClick={onClose}>
      <SC.Modal>{children}</SC.Modal>
    </SC.Overlay>,
    modalRoot
  );
}
