import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { IPost } from '~/interfaces/IPost';
import { spacing } from '~/theme';
import TitleArticle from './TitleArticle';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import ContentArticleItem from './ContentArticleItem';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { Button } from '~/baseComponents';

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

  const { rootNavigation } = useRootNavigation();

  const goToArticleDetail = () => {
    rootNavigation.navigate(articleStack.articleContentDetail, { articleId: article?.id });
  };

  return (
    <Button
      style={styles.container}
      onPress={goToArticleDetail}
      testID="series_detail.list_article.article_item"
    >
      <TitleArticle index={index} article={article} seriesId={seriesId} isActor={isActor} />
      <ViewSpacing height={spacing.margin.extraLarge} />
      <ContentArticleItem actor={actor} coverMedia={coverMedia} summary={summary} />
    </Button>
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
