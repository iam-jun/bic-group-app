import {
  ActivityIndicator, RefreshControl, StyleSheet, View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated from 'react-native-reanimated';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';

import useDraftArticleStore from './store';
import { useUserIdAuth } from '~/hooks/auth';
import { IPayloadGetDraftContents } from '~/interfaces/IPost';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';
import Image from '~/components/Image';
import Text from '~/baseComponents/Text';
import images from '~/resources/images';
import dimension, { homeHeaderTabHeight, homeHeaderContentContainerHeight } from '~/theme/dimension';
import DraftArticleView from './components/DraftArticleView';

const HeaderFilterHeight = homeHeaderTabHeight + homeHeaderContentContainerHeight;

interface DraftArticleProps {
  onScroll: (e: any) => void;
}

const DraftArticle: React.FC<DraftArticleProps> = ({ onScroll }) => {
  const [lossInternet, setLossInternet] = useState(false);
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle();
  const userId = useUserIdAuth();
  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);

  const {
    articles: draftArticles, hasNextPage, refreshing, actions,
  } = useDraftArticleStore();

  useEffect(() => {
    getData(true);
  }, []);

  useEffect(() => {
    if (isInternetReachable) {
      if (lossInternet) {
        setLossInternet(false);
        getData(false);
      }
    } else {
      setLossInternet(true);
    }
  }, [isInternetReachable]);

  const getData = (isRefreshing?: boolean) => {
    if (!userId) return;

    const payload: IPayloadGetDraftContents = {
      isRefresh: isRefreshing,
    };
    actions.getDraftArticles(payload);
  };

  const onRefresh = () => {
    getData(true);
  };

  const onLoadMore = () => {
    getData(false);
  };

  const renderItem = ({ item }: any) => <DraftArticleView data={item} />;

  const renderHeader = () => (
    <View style={styles.header}>
      <ViewSpacing height={spacing.margin.large} />
    </View>
  );

  const renderFooter = () => (
    <View>
      {hasNextPage && !refreshing && (
        <View testID="draft_article.load_more_view" style={styles.listFooter}>
          <ActivityIndicator color={colors.gray20} />
        </View>
      )}
      {!refreshing && !hasNextPage && (
        <ViewSpacing height={spacing.margin.large} />
      )}
    </View>
  );

  const renderEmpty = () => {
    if (draftArticles.length === 0 && refreshing) {
      return null;
    }

    return (
      <View testID="draft_article.empty_view" style={styles.emptyContainer}>
        <Image source={images.img_empty_draft} style={styles.imgEmpty} />
        <Text.H6 useI18n color={colors.gray50}>
          post:draft:title_no_draft_articles
        </Text.H6>
        <Text useI18n color={colors.gray50}>
          post:draft:text_no_draft_articles
        </Text>
      </View>
    );
  };

  const renderSeparatorComponent = () => (
    <ViewSpacing height={spacing.margin.large} />
  );

  return (
    <Animated.FlatList
      testID="draft_article.list"
      style={styles.listContainer}
      data={draftArticles}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      ItemSeparatorComponent={renderSeparatorComponent}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.gray40}
          progressViewOffset={HeaderFilterHeight}
        />
      )}
      keyExtractor={(item, index) => `list-draft-articles-${item.id}-${index}`}
      onScroll={onScroll}
    />
  );
};

const createStyle = () => StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  listFooter: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: dimension.deviceHeight * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgEmpty: {
    width: 250,
    height: 200,
  },
  header: {
    paddingTop: HeaderFilterHeight,
  },
});

export default DraftArticle;
