import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from '~/baseComponents/Icon';
import { ITag } from '~/interfaces/ITag';
import { spacing } from '~/theme';
import TagItem from './components/TagItem';

export type Props = {
  data: ITag[];
  onPressTag: (tagData: ITag) => void;
};

const TagsView: FC<Props> = ({ data, onPressTag }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const renderItem = (item: ITag) => (
    <TagItem key={`tag_${item.id}`} data={item} onPressTag={onPressTag} />
  );

  return (
    <View style={styles.row}>
      <Icon
        size={18}
        tintColor={colors.neutral20}
        icon="Tag"
        style={styles.iconTag}
      />
      <View style={styles.container}>{data.map(renderItem)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  iconTag: {
    marginRight: spacing.margin.small,
    marginTop: spacing.margin.base,
  },
});

export default TagsView;
