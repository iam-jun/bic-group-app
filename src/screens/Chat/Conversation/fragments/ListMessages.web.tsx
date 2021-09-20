import React from 'react';
import {FlatList, FlatListProps} from 'react-native';
import Div from '~/beinComponents/Div';

interface Props extends FlatListProps<any> {
  listRef: React.Ref<FlatList>;
  onScroll: (event: any) => void;
}

const ListMessages = ({listRef, onScroll, ...props}: Props) => {
  return (
    <Div nativeID="chat-wrapper" onScroll={onScroll}>
      <Div nativeID="chat-container">
        <FlatList ref={listRef} {...props} />
      </Div>
    </Div>
  );
};

export default ListMessages;
