import React, { useEffect, useRef } from 'react';
import {
  ScrollView,
} from 'react-native';

import { useDispatch } from 'react-redux';
import BottomSheet from '~/baseComponents/BottomSheet';
import { BaseBottomSheetProps } from '~/baseComponents/BottomSheet/BaseBottomSheet';
import { useKeySelector } from '~/hooks/selector';
import BottomListItem, { BottomListItemProps } from './BottomListItem';
import modalKeySelector from '~/storeRedux/modal/keySelector';
import modalActions from '~/storeRedux/modal/actions';

export interface BottomListProps extends BaseBottomSheetProps {
  data: BottomListItemProps[];
  ListHeaderComponent?: any;
  showsVerticalScrollIndicator?: boolean;
  closeOutSide?: boolean;
}

const BottomList = () => {
  const dispatch = useDispatch();

  const modalizeRef = useRef<any>();
  const bottomList = useKeySelector(modalKeySelector.bottomList);
  const {
    data = [],
    isOpen,
    ListHeaderComponent = undefined,
    showsVerticalScrollIndicator = false,
    closeOutSide = true,
  } = bottomList;

  useEffect(() => {
    if (!isOpen) {
      modalizeRef?.current?.close?.();
    }
  }, [isOpen]);

  const _onClose = () => {
    closeOutSide && dispatch(modalActions.hideBottomList());
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
      childrenStyle={{ minHeight: 140 }}
      ContentComponent={renderListData()}
    />
  );
};

export default BottomList;
