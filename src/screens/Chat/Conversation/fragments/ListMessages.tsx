import React from 'react';
import {FlatList, FlatListProps} from 'react-native';

interface Props extends FlatListProps<any> {
  onScroll: (event: any) => void;
}

const ListMessages = (props: Props) => {
  return <FlatList {...props} />;
};

export default ListMessages;
