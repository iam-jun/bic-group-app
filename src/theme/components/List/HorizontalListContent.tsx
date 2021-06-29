import React from 'react';
import {TouchableOpacity, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import ThemeView from '../ThemeView';
import ReactionActionItem from '../List/items/ReactionActionItem';
import {reactionActionsType} from './items/ContentItem';

export interface Props {
  style?: StyleProp<ViewStyle>;
  data: reactionActionsType[];
  type?: string;
  onPress?: (item: reactionActionsType) => void;
}

const HorizontalListContent: React.FC<Props> = ({
  style,
  data,
  type,
  onPress,
  ...props
}) => {
  return (
    <ThemeView style={[styles.container, style]}>
      {data.map((item: reactionActionsType, index: number) => (
        <TouchableOpacity
          key={`{${type}-${index}`}
          style={[styles.itemContainer]}
          onPress={() => onPress && onPress(item)}>
          <ReactionActionItem {...props} {...item} index={index} />
        </TouchableOpacity>
      ))}
    </ThemeView>
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

export default HorizontalListContent;
