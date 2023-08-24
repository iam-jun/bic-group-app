import React, { useEffect, useRef } from 'react';
import {
  ScrollView,
} from 'react-native';

import BottomSheet from '~/baseComponents/BottomSheet';
import { BaseBottomSheetProps } from '~/baseComponents/BottomSheet/BaseBottomSheet';
import BottomListItem, { BottomListItemProps } from './BottomListItem';
import useModalStore from '~/store/modal';

export interface BottomListProps extends BaseBottomSheetProps {
  data: BottomListItemProps[];
  ListHeaderComponent?: any;
  showsVerticalScrollIndicator?: boolean;
  closeOutSide?: boolean;
}

const BottomList = () => {
  const modalizeRef = useRef<any>();
  const {
    data = [],
    isOpen = false,
    ListHeaderComponent = undefined,
    showsVerticalScrollIndicator = false,
    closeOutSide = true,
  } = useModalStore((state) => state.bottomList) || {};
  const modalActions = useModalStore((state) => state.actions);

  useEffect(() => {
    if (!isOpen) {
      modalizeRef?.current?.close?.();
    }
  }, [isOpen]);

  const _onClose = () => {
    if (!closeOutSide) return;
    modalActions.hideBottomList();
  };

  const renderListData = () => (
    <ScrollView showsVerticalScrollIndicator={showsVerticalScrollIndicator}>
      {ListHeaderComponent}
      {
        data.map((item: any) => (
          <BottomListItem key={`MenuItem_${item?.title}`} {...item} />))
      }
    </ScrollView>
  );

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      isOpen={isOpen}
      onClose={_onClose}
      ContentComponent={renderListData()}
    />
  );
};

export default BottomList;
