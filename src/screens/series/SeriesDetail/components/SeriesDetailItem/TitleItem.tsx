import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import Text from '~/baseComponents/Text';
import { IPost, PostType } from '~/interfaces/IPost';
import { spacing, dimension } from '~/theme';
import { formatNumberWithZeroPrefix, escapeMarkDown } from '~/utils/formatter';
import { Button } from '~/baseComponents';
import useSeriesDetailItemMenu from './useSeriesDetailItemMenu';
import { useBaseHook } from '~/hooks';

type TitleItemProps = {
    index: number;
    item: IPost;
    seriesId: string;
    isActor: boolean;
}

const TitleItem: FC<TitleItemProps> = ({
  index, item, seriesId, isActor,
}) => {
  const { title, id, content } = item || {};
  const { t } = useBaseHook();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const titleItem = item?.type === PostType.ARTICLE ? title : escapeMarkDown(content);

  const { showMenu } = useSeriesDetailItemMenu(seriesId, id, item?.type);

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text.H1 color={colors.neutral20}>{formatNumberWithZeroPrefix(index)}</Text.H1>
        <View style={styles.slash} />
        <View style={{ flex: 1 }}>
          {!!titleItem ? <Text.H3 numberOfLines={1} color={colors.neutral80}>{ titleItem }</Text.H3>
            : (
              <RNText
                numberOfLines={1}
                style={styles.noContent}
              >
                { t('series:text_no_content') }
              </RNText>
            )}
        </View>
      </View>
      {isActor
      && (
      <Button.Raise
        icon="menu"
        size="small"
        testID="content_header.menu"
        onPress={showMenu}
      />
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    slash: {
      marginHorizontal: spacing.margin.small,
      borderLeftWidth: 1,
      borderLeftColor: colors.neutral20,
      height: 44,
      transform: [
        {
          rotate: '15deg',
        },
      ],
    },
    titleView: {
      flex: 1,
      marginRight: spacing.margin.small,
      flexDirection: 'row',
      alignItems: 'center',
    },
    noContent: {
      fontStyle: 'italic',
      fontWeight: '600',
      fontSize: dimension?.sizes.h3,
      color: colors.neutral30,
    },
  });
};

export default TitleItem;
