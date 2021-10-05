import React, {useRef} from 'react';
import {FlatList, FlatListProps} from 'react-native';

interface Props extends FlatListProps<any> {
  listRef?: React.RefObject<FlatList> | null;
  onViewableItemsChanged: (changed: any) => void;
}

const ListMessages = ({listRef, onViewableItemsChanged, ...props}: Props) => {
  let initiated = false;

  const _onViewableItemsChanged = useRef((event: any) => {
    if (!initiated) onViewableItemsChanged(event.changed);
    initiated = true;
  });

  return (
    <FlatList
      ref={listRef}
      {...props}
      onViewableItemsChanged={_onViewableItemsChanged.current}
    />
  );
};

export default ListMessages;
