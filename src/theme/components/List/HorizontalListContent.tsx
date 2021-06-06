import React from 'react';
import {TouchableOpacity, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import ThemeView from '../ThemeView';
import ReactionActionItem from '../List/items/ReactionActionItem';
import icons from '~/constants/icons';

export interface Data {
  icon: keyof typeof icons;
  isLike: boolean;
  label: string;
  type: string;
  value: number;
}

export interface Props {
  style?: StyleProp<ViewStyle>;
  data?: Data[];
  type?: string;
}

const HorizontalListContent: React.FC<Props> = ({
  style,
  data,
  type,
  ...props
}) => {
  return (
    <ThemeView style={[styles.container, style]}>
      {data.map((item, index: number) => (
        <TouchableOpacity
          key={`{${type}-${index}`}
          style={[styles.itemContainer]}>
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
