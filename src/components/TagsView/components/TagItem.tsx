import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import Tag from '~/baseComponents/Tag';
import { ITag } from '~/interfaces/ITag';
import { spacing } from '~/theme';

export type Props = {
  data: ITag;
  onPressTag: (tagData: ITag) => void;
};

const SPACING_HITSLOP = spacing.margin.small / 2;

const TagItem: FC<Props> = ({ data, onPressTag }) => {
  const styles = createStyles();

  const onActionPress = () => {
    onPressTag(data);
  };

  return (
    <View style={styles.container}>
      <Tag
        type="tags"
        style={styles.tag}
        textProps={{ numberOfLines: 1 }}
        textStyle={styles.textTag}
        buttonProps={{
          hitSlop: {
            top: SPACING_HITSLOP,
            bottom: SPACING_HITSLOP,
            left: SPACING_HITSLOP,
            right: SPACING_HITSLOP,
          },
        }}
        label={data?.name?.toUpperCase()}
        onActionPress={onActionPress}
        testID={`tag_item_${data.id}.button_navigate`}
      />
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    paddingRight: spacing.margin.small,
    marginTop: spacing.margin.small,
  },
  tag: {
    marginRight: 0,
  },
  textTag: {
    fontSize: 10,
  },
});

export default TagItem;
