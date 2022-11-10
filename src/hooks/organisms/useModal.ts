import { createSignal } from "solid-js";

export const useModal = (initialStatus = false) => {
  const [isOpen, setIsOpen] = createSignal(initialStatus);

  const onOpen = (): void => {
    setIsOpen(true);
  };

  const onClose = (): void => {
    setIsOpen(false);
  };

  return { isOpen, onOpen, onClose } as const;
};
