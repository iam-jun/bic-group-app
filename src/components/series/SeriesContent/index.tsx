import React, { FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';

import DescriptionSection from './DescriptionSection';
import TitleSection from './TitleSection';
import ListArticle from './ListArticle';

import { spacing } from '~/theme';
import { Button } from '~/baseComponents';
import { ContentInterestedUserCount } from '~/components/ContentView';
import { useRootNavigation } from '~/hooks/navigation';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { IPost } from '~/interfaces/IPost';

const LIMIT_ARTICLE = 3;

type SeriesContentProps = {
  series: IPost;
  isLite?: boolean;
};

const SeriesContent: FC<SeriesContentProps> = ({ series, isLite }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const {
    id,
    title,
    updatedAt,
    coverMedia,
    summary,
    totalUsersSeen,
    articles,
    titleHighlight,
    summaryHighlight,
  } = series || {};
  const { rootNavigation } = useRootNavigation();
  const [articleShowAll, setArticleShowAll] = useState(false);
  const listArticle = articleShowAll ? articles : articles?.slice?.(0, LIMIT_ARTICLE);
  const titleSection = isLite && titleHighlight ? titleHighlight : title;
  const summarySection = isLite && summaryHighlight ? summaryHighlight : summary;

  const goToSeriesDetail = () => {
    rootNavigation.navigate(seriesStack.seriesDetail, { seriesId: id });
  };

  const onToggleShowArticle = () => {
    setArticleShowAll(!articleShowAll);
  };

  const renderListArticle = () => (
    <ListArticle
      listArticle={listArticle}
    />
  );

  const renderRowOptions = () => (
    <View style={[styles.default, articles?.length > LIMIT_ARTICLE && styles.row, !!isLite && styles.rowLite]}>
      {articles?.length > LIMIT_ARTICLE && (
        <Text.SubtitleM
          testID="series_content.short_content"
          onPress={onToggleShowArticle}
          color={colors.neutral60}
          useI18n
        >
          {articleShowAll
            ? 'common:text_see_less'
            : 'common:text_see_more'}
        </Text.SubtitleM>
      )}
      <ContentInterestedUserCount
        id={id}
        interestedUserCount={totalUsersSeen}
        style={styles.interestedUserCount}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Button onPress={goToSeriesDetail}>
        <TitleSection
          title={titleSection}
          time={updatedAt}
          numberOfArticles={articles?.length}
          img={coverMedia?.url}
        />
      </Button>
      <DescriptionSection description={summarySection} />
      {renderListArticle()}
      {renderRowOptions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.padding.small,
    paddingHorizontal: spacing.padding.large,
    paddingBottom: spacing.padding.xSmall,
  },
  default: {
    paddingVertical: spacing.padding.base,
    marginTop: spacing.margin.base,
  },
  row: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  interestedUserCount: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    margin: 0,
    alignItems: 'flex-end',
  },
  rowLite: {
    paddingVertical: 0,
  },
});

export default SeriesContent;
