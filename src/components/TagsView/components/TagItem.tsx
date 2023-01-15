import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import Tag from '~/baseComponents/Tag';
import { ITag } from '~/interfaces/ITag';
import { spacing } from '~/theme';

export type Props = {
  data: ITag;
  maxWidthOfTag: number;
  onPressTag: (tagData: ITag) => void;
};

const SPACING_HITSLOP = spacing.margin.small / 2;

const TagItem: FC<Props> = ({ data, maxWidthOfTag, onPressTag }) => {
  const styles = createStyles(maxWidthOfTag);

  const onActionPress = () => {
    onPressTag(data);
  };

  return (
    <View style={styles.container}>
      <Tag
        type="tags"
        style={styles.tag}
        textProps={{ numberOfLines: 1 }}
        buttonProps={{
          hitSlop: {
            top: SPACING_HITSLOP,
            bottom: SPACING_HITSLOP,
            left: SPACING_HITSLOP,
            right: SPACING_HITSLOP,
          },
        }}
        label={data.name}
        onActionPress={onActionPress}
        testID={`tag_item_${data.id}.button_navigate`}
      />
    </View>
  );
};

const createStyles = (maxWidthOfTag: number) => StyleSheet.create({
  container: {
    paddingRight: spacing.margin.small,
    marginTop: spacing.margin.small,
    maxWidth: maxWidthOfTag,
  },
  tag: {
    marginRight: 0,
  },
});

export default TagItem;
