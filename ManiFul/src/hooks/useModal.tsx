import { useState } from 'react';

interface ModalItem {
  id: string;
  content: React.ReactNode;
  disableClosing?: boolean;
  closeButton?: boolean;
}

interface UseModalResults {
  isOpen: boolean;
  openModal: (
    content: React.ReactNode,
    customId?: string,
    options?: {
      disableClosing?: boolean;
      closeButton?: boolean;
    },
  ) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  modals: ModalItem[];
}

export default function useModal(): UseModalResults {
  const [modals, setModals] = useState<ModalItem[]>([]);

  const closeAllModals = () => setModals([]);

  const openModal = (
    content: React.ReactNode,
    customId?: string,
    options?: {
      disableClosing?: boolean;
      closeButton?: boolean;
    },
  ) => {
    const id = customId ?? Math.random().toString(36).substring(2, 9); //billions of possible combinations. Play the lottery if id collision happens.

    setModals(prev => {
      if (customId && prev.some(m => m.id === customId)) return prev;

      return [...prev, { id, content, ...options }];
    });

    return id;
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
    closeAllModals,
    modals,
    isOpen: modals.length > 0,
  };
}
