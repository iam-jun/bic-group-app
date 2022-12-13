import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { IPost } from '~/interfaces/IPost';
import { spacing } from '~/theme';
import TitleArticle from './TitleArticle';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import ContentArticleItem from './ContentArticleItem';

type SeriesDetailArticleItemProps = {
    article: IPost;
    index: number;
    seriesId: string;
    isActor: boolean;
}

const SeriesDetailArticleItem: FC<SeriesDetailArticleItemProps> = ({
  article, index, seriesId, isActor,
}) => {
  const {
    actor, coverMedia, summary,
  } = article || {};
  const theme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <TitleArticle index={index} article={article} seriesId={seriesId} isActor={isActor} />
      <ViewSpacing height={spacing.margin.extraLarge} />
      <ContentArticleItem actor={actor} coverMedia={coverMedia} summary={summary} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      padding: spacing.padding.large,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray1,
    },
  });
};

export default SeriesDetailArticleItem;
