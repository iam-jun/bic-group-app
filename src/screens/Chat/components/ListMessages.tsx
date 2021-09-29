import React from 'react';
import {FlatList, FlatListProps} from 'react-native';

interface Props extends FlatListProps<any> {
  listRef?: React.RefObject<FlatList> | null;
}

const ListMessages = ({listRef, ...props}: Props) => {
  return <FlatList ref={listRef} {...props} />;
};

export default ListMessages;
