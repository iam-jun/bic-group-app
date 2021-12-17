import React, {useRef, useEffect} from 'react';
import {Platform, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';

import BottomSheet from '~/beinComponents/BottomSheet';
import {useKeySelector} from '~/hooks/selector';
import modalKeySelector from '~/store/modal/keySelector';
import modalActions from '~/store/modal/actions';

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
  } = modal || {};

  useEffect(() => {
    if (!isOpen) {
      modalizeRef?.current?.close?.();
    }
  }, [isOpen]);

  const _onClose = () => {
    dispatch(modalActions.hideModal());
  };

  if (Platform.OS !== 'web' && !useAppBottomSheet) {
    return (
      <Modal
        visible={isOpen}
        transparent={true}
        onRequestClose={() => {
          dispatch(modalActions.hideModal());
        }}>
        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.flatten([appModalStyle, styles.appModalContainer])}
          onPress={_onClose}>
          {ContentComponent}
        </TouchableOpacity>
      </Modal>
    );
  }

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      isContextMenu={false}
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
