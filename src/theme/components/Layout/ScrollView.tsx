import React from 'react';
import {Animated, ViewStyle, StyleProp} from 'react-native';

import ListView from '~/theme/components/List/ListView';
import {UserType} from '../List/items/GroupItem';

interface DataType {
  user: UserType;
  updatedAt: string;
  newPostCount: number;
}

interface ListType {
  type: string;
  data: DataType[];
}

interface Props {
  style?: StyleProp<ViewStyle>;
  renderHeader?: Function;
  list: ListType;
  children?: React.ReactNode;
}

const ScrollView: React.FC<Props> = ({
  style,
  renderHeader,
  list,
  children,
  ...props
}) => {
  const renderList = () => {
    return <ListView {...list} />;
  };

  return (
    <Animated.ScrollView {...props} style={style}>
      {renderHeader && renderHeader()}
      {children || renderList()}
    </Animated.ScrollView>
  );
};

export default ScrollView;
