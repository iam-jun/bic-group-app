import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import Modal from 'react-modal';
import {StyleSheet, View} from 'react-native';
import {Portal, useTheme} from 'react-native-paper';

import Button from '~/beinComponents/Button';
import {ITheme} from '~/theme/interfaces';

Modal.setAppElement('#app-root');

export interface WebModalProps {
  ref?: any;
  isOpen: boolean;
  children?: React.ReactNode;
  ContentComponent?: React.ReactNode;
  onClose?: () => void;
}

const _WebModal = (
  {isOpen = false, children, ContentComponent, onClose}: WebModalProps,
  ref: any,
) => {
  const [showModal, setShowModal] = useState(isOpen);
  const {colors}: ITheme = useTheme() as ITheme;

  const open = () => {
    setShowModal(true);
  };

  const close = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (isOpen) {
      open();
    } else {
      close();
    }
  }, [isOpen]);

  const _onClose = () => {
    setShowModal(false);
    onClose?.();
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  const renderModal = () => {
    return (
      <Portal>
        <Modal isOpen={showModal} onRequestClose={onClose} style={modalStyles}>
          {ContentComponent}
          <View style={styles.closeButtonContainer}>
            <Button.Icon
              icon={'iconClose'}
              tintColor={colors.primary7}
              onPress={_onClose}
            />
          </View>
        </Modal>
      </Portal>
    );
  };

  return (
    <>
      {children}
      {renderModal()}
    </>
  );
};

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '50%',
    minHeight: '50%',
    paddingTop: '10%',
  },
};

const styles = StyleSheet.create({
  closeButtonContainer: {
    position: 'absolute',
    top: '5%',
    right: '5%',
  },
});

const WebModal = forwardRef(_WebModal);

export default WebModal;
