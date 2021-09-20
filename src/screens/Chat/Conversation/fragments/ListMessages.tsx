import React from 'react';
import {FlatList, FlatListProps} from 'react-native';

const ListMessages = (props: FlatListProps<any>) => {
  return <FlatList {...props} />;
};

export default ListMessages;
