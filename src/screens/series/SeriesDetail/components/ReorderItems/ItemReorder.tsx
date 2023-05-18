import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { dimension } from '~/theme';
import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import { IPost, PostType } from '~/interfaces/IPost';
import Text from '~/baseComponents/Text';
import { formatNumberWithZeroPrefix, escapeMarkDown } from '~/utils/formatter';
import { getTitlePostItemInSeries } from '~/helpers/common';

const MARGIN_HORIZONTAL = 30;
const MARGIN_VERTICAL = 8;

export const ITEM_WIDTH = dimension.deviceWidth - 2 * MARGIN_HORIZONTAL;
export const ITEM_HEIGHT = 36 + 2 * MARGIN_VERTICAL;

type ItemReorderProps = {
    index: number;
    item: IPost
}

const ItemReorder: FC<ItemReorderProps> = ({ index, item }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { title, content } = item || {};
  const escapeMarkDownContent = escapeMarkDown(content);
  const titlePost = getTitlePostItemInSeries(escapeMarkDownContent);
  const titleItem = item?.type === PostType.ARTICLE ? title : titlePost;

  return (
    <View style={styles.container}>
      <View style={[styles.itemContainer]}>
        <View style={styles.drag}>
          <Icon size={spacing.margin.base} icon="Bars" tintColor={colors.white} />
        </View>
        <Text.H4 color={colors.neutral20}>{formatNumberWithZeroPrefix(index + 1)}</Text.H4>
        <Text style={styles.slash}>/</Text>
        <View style={{ flex: 1 }}>
          {titleItem ? (
            <Text.BodyMMedium
              numberOfLines={1}
              color={colors.neutral80}
            >
              { titleItem }
            </Text.BodyMMedium>
          ) : (
            <Text.BodyMMedium
              numberOfLines={1}
              color={colors.neutral80}
              useI18n
            >
              series:text_no_content
            </Text.BodyMMedium>
          )}
        </View>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
    },
    itemContainer: {
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      paddingVertical: MARGIN_VERTICAL,
      //   justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    drag: {
      width: 24,
      height: '100%',
      backgroundColor: colors.neutral20,
      marginRight: spacing.margin.base,
      justifyContent: 'center',
      alignItems: 'center',
    },
    slash: {
      color: colors.neutral20,
      marginHorizontal: spacing.margin.small,
    },
  });
};

export default ItemReorder;
