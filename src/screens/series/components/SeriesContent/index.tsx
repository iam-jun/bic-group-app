import React, { FC } from 'react';
import { View } from 'react-native';
import DescriptionSection from './DescriptionSection';
import TitleSection from './TitleSection';
import { spacing } from '~/theme';
import { Button } from '~/baseComponents';
import { useRootNavigation } from '~/hooks/navigation';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { IPost } from '~/interfaces/IPost';

type SeriesContentProps = {
  series: IPost;
};

const SeriesContent: FC<SeriesContentProps> = ({ series }) => {
  const {
    id, title, updatedAt, coverMedia, summary,
  } = series || {};
  const { rootNavigation } = useRootNavigation();

  const goToSeriesDetail = () => {
    rootNavigation.navigate(seriesStack.seriesDetail, { seriesId: id });
  };

  return (
    <View style={{ padding: spacing.padding.large }}>
      <Button onPress={goToSeriesDetail}>
        <TitleSection
          title={title}
          time={updatedAt}
          numberOfArticles={9}
          img={coverMedia?.url}
        />
      </Button>
      <DescriptionSection description={summary} />
      {/* for the next sprint */}
      {/* <ListArticle
        lstArticle={[
          {
            id: '1',
            title:
              'Be The First Line List Series. Be The First Line List Series. Be The First Line List Series.',
          },
          {
            id: '2',
            title: 'Be The First Line List Series.',
          },
          {
            id: '3',
            title: 'Be The First Line List Series.',
          },
        ]}
      /> */}
    </View>
  );
};

export default SeriesContent;
