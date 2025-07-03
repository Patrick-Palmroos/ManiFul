import { useState } from 'react';

interface ModalItem {
  id: string;
  content: React.ReactNode;
}

interface UseModalResults {
  isOpen: boolean;
  openModal: (content: React.ReactNode) => void;
  closeModal: (id: string) => void;
  modals: ModalItem[];
}

export default function useModal(): UseModalResults {
  const [modals, setModals] = useState<ModalItem[]>([]);

  const openModal = (content: React.ReactNode) => {
    const id = Math.random().toString(36).substring(2, 9); //billions of possible combinations. Play the lottery if id collision happens.
    setModals(prev => [...prev, { id, content }]);
    return id; // return ID to optionally control this modal later
  };

  const closeModal = (id?: string) => {
    setModals(prev => {
      if (!id) return prev.slice(0, -1); // close top modal
      return prev.filter(m => m.id !== id);
    });
  };

  return {
    openModal,
    closeModal,
    modals,
    isOpen: modals.length > 0,
  };
}
