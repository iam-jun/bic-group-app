import React from 'react';
import {FlatList, FlatListProps} from 'react-native';
import Div from '~/beinComponents/Div';

interface Props extends FlatListProps<any> {
  onScroll: (event: any) => void;
}

const ListMessages = ({onScroll, ...props}: Props) => {
  return (
    <Div nativeID="chat-wrapper" onScroll={onScroll}>
      <Div nativeID="chat-container">
        <FlatList {...props} />
      </Div>
    </Div>
  );
};

export default ListMessages;
