import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ITag } from '~/interfaces/ITag';
import TagItem from './components/TagItem';
import { calculateMaxWidthOfTag } from './helper';

export type Props = {
  data: ITag[];
  onPressTag: (tagData: ITag) => void;
};

const TagsView: FC<Props> = ({ data, onPressTag }) => {
  const maxWidthOfTag = calculateMaxWidthOfTag(data.length);

  const renderItem = (item: ITag) => (
    <TagItem key={`tag_${item.id}`} data={item} maxWidthOfTag={maxWidthOfTag} onPressTag={onPressTag} />
  );

  return <View style={styles.container}>{data.map(renderItem)}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default TagsView;
