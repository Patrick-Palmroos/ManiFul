import React, { createContext, useContext } from 'react';
import useModal from '../hooks/useModal';
import Modal from '../components/Modal/Modal';

const ModalContext = createContext<ReturnType<typeof useModal> | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const modal = useModal();

  return (
    <ModalContext.Provider value={modal}>
      {children}
      {modal.modals.map(({ id, content }) => (
        <Modal key={id} onClose={() => modal.closeModal(id)}>
          {content}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used inside ModalProvider');
  return context;
};
