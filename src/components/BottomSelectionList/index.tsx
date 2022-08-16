import React, { useEffect, useRef } from 'react'
import {
  ScrollView,
  StyleProp, ViewStyle,
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
  renderItem?: ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }
  ) => React.ReactElement;
  ListHeaderComponent?: any;
  ListFooterComponent?: any;
  ListEmptyComponent?: any;
  showsVerticalScrollIndicator?: boolean;
  onItemPress?: (...params: any) => void;
  onItemLongPress?: (...params: any) => void;
  onEndReachedThreshold?: number;
  itemStyle?: StyleProp<ViewStyle>;
  horizontal?: boolean;
  children?: React.ReactNode;
  closeOutSide?: boolean;
}

const BottomSelectionList = ({
}) => {
  const dispatch = useDispatch();

  const modalizeRef = useRef<any>();
  const bottomSelectionList = useKeySelector(modalKeySelector.bottomSelectionList);
  const {
    data = [], isOpen, ListHeaderComponent = undefined, children, showsVerticalScrollIndicator, onItemPress,
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

  //   const _renderItem = ({ item, index }: {item: any, index:number}) => {
  //     if (!!renderItem) return renderItem({ item, index });
  //     return (
  //       <View style={}>
  //         <Text>{index}</Text>
  //       </View>
  //     )
  //   }

  const renderListData = () => (
    <ScrollView>
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
