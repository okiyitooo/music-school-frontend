import React from 'react';
import { Modal as ChakraModal, ModalOverlay, ModalContent, ModalHeader, 
            ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure } from '@chakra-ui/react';

const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText = "Confirm", cancelText = "Cancel" }) => {
    
    const {onClose: closeModal} = useDisclosure({isOpen, onClose})
    const handleConfirm = () => {
        if (onConfirm)
            onConfirm();
        closeModal();
    }
    return (
        <ChakraModal isOpen={isOpen} onClose={closeModal} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {children}
                </ModalBody>
                <ModalFooter>
                    {onConfirm && <Button colorScheme="green" mr={3} onClick={handleConfirm}>{confirmText}</Button>}
                    <Button colorScheme="red" variant="ghost" onClick={closeModal}>{cancelText}</Button>
                </ModalFooter>
            </ModalContent>
        </ChakraModal>
    );
};

export default Modal;