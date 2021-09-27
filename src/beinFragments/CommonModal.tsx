import React, {useRef, useEffect} from 'react';

import BottomSheet from '~/beinComponents/BottomSheet';
import {useKeySelector} from '~/hooks/selector';
import modalKeySelector from '~/store/modal/keySelector';
import {useDispatch} from 'react-redux';
import modalActions from '~/store/modal/actions';

const CommonModal = () => {
  const modalizeRef = useRef<any>();

  const dispatch = useDispatch();

  const modal = useKeySelector(modalKeySelector.modal);
  const {isOpen, ContentComponent} = modal || {};

  useEffect(() => {
    if (!isOpen) {
      modalizeRef?.current?.close?.();
    }
  }, [isOpen]);

  const _onClose = () => {
    dispatch(modalActions.hideModal());
  };

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      isContextMenu={false}
      isOpen={isOpen}
      onClose={_onClose}
      ContentComponent={ContentComponent}
    />
  );
};

export default CommonModal;
