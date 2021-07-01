import React from 'react';
import {TouchableOpacity, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import ScreenWrapper from '../ScreenWrapper';
import {reactionActionsType} from './items/ContentItem';
import items, {IListViewItem} from './items';

export interface Props {
  style?: StyleProp<ViewStyle>;
  data: reactionActionsType[];
  type: IListViewItem;
  onItemPress?: (item: reactionActionsType, index: number) => void;
}

const HorizontalListView: React.FC<Props> = ({
  style,
  data,
  type,
  onItemPress,
  ...props
}) => {
  const getKeyValue =
    <T extends object, U extends keyof T>(obj: T) =>
    (key: U) =>
      obj[key];

  const Component = getKeyValue(items)(type);
  return (
    <ScreenWrapper style={[styles.container, style]}>
      {data.map((item: any, index: number) => (
        <TouchableOpacity
          key={`{${type}-${index}`}
          style={[styles.itemContainer]}
          onPress={() => onItemPress && onItemPress(item, index)}>
          <Component {...props} {...item} />
        </TouchableOpacity>
      ))}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemContainer: {
    flex: 1,
  },
});

export default HorizontalListView;
