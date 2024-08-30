import React, { FC } from 'react';

interface IDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const DeleteConfirmationModal: FC<IDeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <p className="text-xl font-medium">{message}</p>
        <div className="mt-4 flex justify-between">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-10 rounded"
            onClick={onConfirm}
          >
            Sí
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-4 px-10 rounded"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
