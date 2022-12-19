import { ExtendedTheme, useTheme } from '@react-navigation/native';
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

const TagItem: FC<Props> = ({ data, maxWidthOfTag, onPressTag }) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme, maxWidthOfTag);

  const onActionPress = () => {
    onPressTag(data);
  };

  return (
    <View style={styles.container}>
      <Tag
        style={styles.tag}
        textProps={{ numberOfLines: 1 }}
        label={data.name}
        onActionPress={onActionPress}
        testID={`tag_item_${data.id}.button_navigate`}
      />
    </View>
  );
};

const createStyles = (theme: ExtendedTheme, maxWidthOfTag: number) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingRight: spacing.margin.small,
      marginTop: spacing.margin.small,
      maxWidth: maxWidthOfTag,
    },
    tag: {
      borderRadius: spacing.borderRadius.small,
      marginRight: 0,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.neutral5,
    },
  });
};

export default TagItem;
