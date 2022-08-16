import React, { useEffect, useRef } from 'react'
import {
  ScrollView,
} from 'react-native';

import { useDispatch } from 'react-redux';
import BottomSheet from '~/baseComponents/BottomSheet';
import { BaseBottomSheetProps } from '~/baseComponents/BottomSheet/BaseBottomSheet';
import { useKeySelector } from '~/hooks/selector';
import MenuItem from './MenuItem';
import modalKeySelector from '~/storeRedux/modal/keySelector';
import modalActions from '~/storeRedux/modal/actions';

export interface BottomSelectionListProps extends BaseBottomSheetProps {
  data: any[];
  ListHeaderComponent?: any;
  showsVerticalScrollIndicator?: boolean;
  closeOutSide?: boolean;
}

const BottomSelectionList = ({
}) => {
  const dispatch = useDispatch();

  const modalizeRef = useRef<any>();
  const bottomSelectionList = useKeySelector(modalKeySelector.bottomSelectionList);
  const {
    data = [],
    isOpen,
    ListHeaderComponent = undefined,
    showsVerticalScrollIndicator = false,
    closeOutSide = true,
  } = bottomSelectionList;

  useEffect(() => {
    if (!isOpen) {
      modalizeRef?.current?.close?.();
    }
  }, [isOpen])

  const _onClose = () => {
    closeOutSide && dispatch(modalActions.hideBottomSelectionList());
  };

  const renderListData = () => (
    <ScrollView showsVerticalScrollIndicator={showsVerticalScrollIndicator}>
      {ListHeaderComponent}
      {
        data.map((item: any) => (
          <MenuItem key={`MenuItem_${item?.title}`} {...item} />))
      }
    </ScrollView>
  )

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      isOpen={isOpen}
      onClose={_onClose}
      ContentComponent={renderListData()}
    />
  );
}

export default BottomSelectionList;
