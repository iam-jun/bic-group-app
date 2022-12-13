import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '~/baseComponents/Text';
import { IPost } from '~/interfaces/IPost';
import { spacing } from '~/theme';
import { formatNumberWithZeroPrefix } from '~/utils/formatData';
import { Button } from '~/baseComponents';
import useSeriesDetailArticleItemMenu from './useSeriesDetailArticleItemMenu';

type TitleArticleProps = {
    index: number;
    article: IPost;
    seriesId: string;
    isActor: boolean;
}

const TitleArticle: FC<TitleArticleProps> = ({
  index, article, seriesId, isActor,
}) => {
  const { title, id } = article || {};
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const { showMenu } = useSeriesDetailArticleItemMenu(seriesId, id);

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text.H1 color={colors.neutral20}>{formatNumberWithZeroPrefix(index)}</Text.H1>
        <View style={styles.slash} />
        <View style={{ flex: 1 }}>
          <Text.H3 numberOfLines={1} color={colors.neutral80}>{title}</Text.H3>
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
  });
};

export default TitleArticle;
