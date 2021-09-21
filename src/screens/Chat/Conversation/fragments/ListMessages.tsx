import React from 'react';
import {FlatList, FlatListProps} from 'react-native';

interface Props extends FlatListProps<any> {
  listRef?: React.MutableRefObject<FlatList> | null;
  onScroll: (event: any) => void;
}

const ListMessages = ({listRef, ...props}: Props) => {
  return <FlatList ref={listRef} {...props} />;
};

export default ListMessages;
