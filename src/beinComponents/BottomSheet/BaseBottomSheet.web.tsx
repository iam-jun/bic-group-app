import React from 'react';
import Modal from 'react-modal';
import {StyleSheet, View} from 'react-native';
import {Portal, useTheme} from 'react-native-paper';

import Button from '~/beinComponents/Button';
import {ITheme} from '~/theme/interfaces';
import {BaseBottomSheetProps} from './BaseBottomSheet';

Modal.setAppElement('#app-root');

const BaseBottomSheet: React.FC<BaseBottomSheetProps> = ({
  isOpen,
  children,
  ContentComponent,
  onClose,
}: BaseBottomSheetProps) => {
  const {colors}: ITheme = useTheme();

  const renderModal = () => {
    return (
      <Portal>
        <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles}>
          <View style={styles.closeButtonContainer}>
            <Button.Icon
              icon="iconClose"
              tintColor={colors.primary7}
              onPress={onClose}
            />
          </View>
          {ContentComponent}
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
    paddingTop: '5%',
  },
};

const styles = StyleSheet.create({
  closeButtonContainer: {
    position: 'absolute',
    top: '5%',
    right: '5%',
  },
});

export default BaseBottomSheet;
