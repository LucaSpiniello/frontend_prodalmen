import React, { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import Modal, { ModalBody, ModalFooter, ModalHeader } from './ui/Modal';
import Button, { TButtonVariants } from './ui/Button';
import Tooltip from './ui/Tooltip';
import { TColors } from '../types/colors.type';
import { TColorIntensity } from '../types/colorIntensities.type';

interface IComponentProps {
  children: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title?: string | boolean;
  textButton?: string | null;
  icon?: ReactNode;
  size?: number;
  textTool?: string;
  width?: string;
  height?: string;
  variant?: TButtonVariants;
  onClicked?: Dispatch<SetStateAction<any>>;
  modalAction?: boolean;
  color?: TColors;
  colorIntensity?: TColorIntensity,
  isAnimation?: boolean;
	isCentered?: boolean;
	isScrollable?: boolean;
	isStaticBackdrop?: boolean;
}

const ModalForm: FC<IComponentProps> = ({
  children,
  open,
  onClicked,
  setOpen,
  title,
  textButton,
  size,
  icon,
  textTool,
  width,
  height,
  variant,
  modalAction,
  color,
  colorIntensity,
  isAnimation,
	isCentered,
	isScrollable,
}) => {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
        <Button
          color={color}
          title={textTool}
          colorIntensity={colorIntensity}
          variant={variant}
          className={`${width} ${height} text-[14px] font-700 rounded-md flex items-center justify-center dark:text-white text-white`}
          onClick={() => {
            handleOpen();
            if (onClicked) {
              onClicked;
            }
          }}
        >
          {textButton || icon}
        </Button>
      <Modal
        isStaticBackdrop={modalAction}
        size={size}
        isAnimation={isAnimation} 
        isCentered={isCentered} 
        isScrollable={isScrollable} 
        isOpen={open}
        setIsOpen={handleClose}
      >
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
      </Modal>
    </>
  );
};

export default ModalForm;
