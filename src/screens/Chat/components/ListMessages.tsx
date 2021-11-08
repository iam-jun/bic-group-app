import {FlatList} from '@stream-io/flat-list-mvcp';
import React, {useRef} from 'react';
import {FlatListProps} from 'react-native';

interface Props extends FlatListProps<any> {
  listRef?: React.RefObject<FlatList> | null;
  onViewableItemsChanged: (changed: any) => void;
}

const ListMessages = ({listRef, onViewableItemsChanged, ...props}: Props) => {
  let initiated = false;
  // useRef doesn't work with state
  const _onViewableItemsChanged = useRef((event: any) => {
    if (!initiated) onViewableItemsChanged(event.changed);
    initiated = true;
  });

  return (
    <FlatList
      nativeID={'list-messages'}
      ref={listRef}
      {...props}
      onViewableItemsChanged={_onViewableItemsChanged.current}
    />
  );
};

export default ListMessages;
