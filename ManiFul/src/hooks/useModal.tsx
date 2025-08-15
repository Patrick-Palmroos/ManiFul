import { useState } from 'react';

interface ModalItem {
  id: string;
  content: React.ReactNode | (() => React.ReactNode);
  onCloseModal?: () => void;
  title?: string;
  disableClosing?: boolean;
  closeButton?: boolean;
}

interface UseModalResults {
  isOpen: boolean;
  openModal: (args: ModalItem) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  title?: string;
  modals: ModalItem[];
}

export default function useModal(): UseModalResults {
  const [modals, setModals] = useState<ModalItem[]>([]);

  const closeAllModals = () => setModals([]);

  const openModal = ({
    content,
    id = Math.random().toString(36).substring(2, 9),
    onCloseModal,
    disableClosing,
    title,
    closeButton,
  }: ModalItem) => {
    setModals(prev => {
      if (prev.some(m => m.id === id)) return prev;

      return [
        ...prev,
        {
          id,
          content,
          onCloseModal,
          title,
          disableClosing,
          closeButton,
        },
      ];
    });

    return id;
  };

  const closeModal = (id?: string) => {
    setModals(prev => {
      if (!id) {
        const lastModal = prev[prev.length - 1];
        lastModal?.onCloseModal?.();
        return prev.slice(0, -1);
      }

      const modalToClose = prev.find(m => m.id === id);
      modalToClose?.onCloseModal?.();

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
