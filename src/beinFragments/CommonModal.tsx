import React, { useEffect, useRef } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import BottomSheet from '~/beinComponents/BottomSheet';
import { useKeySelector } from '~/hooks/selector';
import modalActions from '~/store/modal/actions';
import modalKeySelector from '~/store/modal/keySelector';

const CommonModal = () => {
  const modalizeRef = useRef<any>();

  const dispatch = useDispatch();

  const modal = useKeySelector(modalKeySelector.modal);
  const {
    isOpen,
    ContentComponent,
    props,
    useAppBottomSheet = true,
    appModalStyle = {},
    closeOutSide = true,
  } = modal || {};

  useEffect(
    () => {
      if (!isOpen) {
        modalizeRef?.current?.close?.();
      }
    }, [isOpen],
  );

  const _onClose = () => {
    closeOutSide && dispatch(modalActions.hideModal());
  };

  if (!useAppBottomSheet) {
    return (
      <Modal
        visible={isOpen}
        transparent
        onRequestClose={() => {
          dispatch(modalActions.hideModal());
        }}
      >
        <TouchableOpacity
          testID="common_modal.center"
          activeOpacity={1}
          style={StyleSheet.flatten([appModalStyle, styles.appModalContainer])}
          onPress={_onClose}
        >
          {ContentComponent}
        </TouchableOpacity>
      </Modal>
    );
  }

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      isOpen={isOpen}
      onClose={_onClose}
      ContentComponent={ContentComponent}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  appModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(12, 13, 14, 0.5)',
    justifyContent: 'center',
  },
});

export default CommonModal;
