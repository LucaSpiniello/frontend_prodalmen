import React, { Dispatch, FC, SetStateAction } from 'react';
import Modal, { ModalBody, ModalFooter, ModalHeader } from './ui/Modal';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';

interface IErrorModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>
  message: string;
}

const ErrorModal: FC<IErrorModalProps> = ({ isOpen, setIsOpen, message }) => {
  const navigate = useNavigate()
  const handleClose = () => setIsOpen(false);
  const handleReload = () => window.location.reload();
  const handleGoHome = () => navigate('/home/dashboard/', { replace: true })

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="md" isCentered={true}>
      <ModalHeader>
        <span>Error de Conexión</span>
      </ModalHeader>
      <ModalBody>
        <p>{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="solid" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="solid" onClick={handleReload}>
          Recargar
        </Button>
        <Button variant="solid" onClick={handleGoHome}>
          Volver al Inicio
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ErrorModal;
