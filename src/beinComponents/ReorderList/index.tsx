import React, {FC} from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import {SortableList} from '~/beinComponents/ReorderList/SortableList';

export interface ReorderListProps {
  style?: StyleProp<ViewStyle>;
  data?: any[];
  renderItem?: any;
  itemWidth: number;
  itemHeight: number;
  HeaderComponent?: any;
  onChange?: (newIndex: number[]) => void;
}

const ReorderList: FC<ReorderListProps> = ({
  style,
  data,
  renderItem,
  itemWidth = 300,
  itemHeight = 100,
  HeaderComponent,
  onChange,
}: ReorderListProps) => {
  return (
    <View style={style}>
      {!!HeaderComponent && HeaderComponent}
      <SortableList
        item={{width: itemWidth, height: itemHeight}}
        onChange={onChange}>
        {data?.map?.(renderItem)}
      </SortableList>
    </View>
  );
};

export default ReorderList;
