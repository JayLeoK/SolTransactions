import React, { FC } from "react";

type Props = {
  includeToggle: boolean;
  label?: string;
  onClose: () => void; // called when the modal is closed
  children?: React.ReactNode;
};

const Modal: FC<Props> = ({ children, label, onClose, includeToggle }) => {
  const [modalOpen, setModalOpen] = React.useState(true);
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    console.log("modalOpen: ", modalOpen);
    if (modalOpen) {
      const dialog = dialogRef.current;
      if (dialog && !dialog.open) {
        dialog.showModal();
      }
    } else {
      const dialog = dialogRef.current;
      if (dialog) {
        dialog.close();
      }
    }
  }, [modalOpen]);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    const handleClose = () => {
      onClose();
      setModalOpen(false);
    };
    dialog?.addEventListener("close", handleClose);

    return () => {
      dialog?.removeEventListener("close", handleClose);
    };
  });

  return (
    <div>
      {includeToggle ?? (
        <button onClick={() => setModalOpen(true)}>{label}</button>
      )}
      <dialog
        onClick={(e) => {
          //close if click is outside dialog, using clientX and clientY
          const rect = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          ) {
            setModalOpen(false);
          }
        }}
        ref={dialogRef}
      >
        <button onClick={() => setModalOpen(false)}>Close</button>
        {children}
      </dialog>
    </div>
  );
};

export default Modal;
